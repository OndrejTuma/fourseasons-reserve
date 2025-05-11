import { NextResponse } from 'next/server';
import axios from 'axios';
import moment from 'moment';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function checkAvailability(dateTime: string, retryCount = 0): Promise<any> {
  try {
    const response = await axios.get('https://www.fourseasons.com/alt/apps/fshr/shared/esb/OT/availability/375117', {
      params: {
        backward_minutes: 150,
        forward_minutes: 150,
        include_credit_card_results: true,
        include_experiences: true,
        include_unavailable: false,
        party_size: 2,
        require_attributes: 'default,hightop,bar,counter,outdoor',
        source: 'WEB',
        start_date_time: dateTime
      },
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    return response.data;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return checkAvailability(dateTime, retryCount + 1);
    }
    throw error;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = searchParams.get('days')?.split(',').map(Number) || [];
  const time = searchParams.get('time') || '19:00';

  // Create a new ReadableStream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      // Get current date
      let currentDate = moment();
      const maxDate = moment().add(2, 'months');

      const encoder = new TextEncoder();

      while (currentDate.isBefore(maxDate)) {
        // Check if current day is in selected days
        const currentDay = currentDate.day();
        if (days.includes(currentDay)) {
          // Send progress update
          controller.enqueue(encoder.encode(
            `data: ${JSON.stringify({
              type: 'progress',
              date: currentDate.format('YYYY-MM-DD'),
              time: time
            })}\n\n`
          ));

          // Format the date and time for the API
          const dateTime = moment(currentDate).format('YYYY-MM-DD') + 'T' + time;

          try {
            const data = await checkAvailability(dateTime);

            if (data.times_available !== null) {
              // Send success message
              controller.enqueue(encoder.encode(
                `data: ${JSON.stringify({
                  type: 'success',
                  date: currentDate.format('YYYY-MM-DD'),
                  time: time,
                  data: data
                })}\n\n`
              ));
              controller.close();
              return;
            }
          } catch (error) {
            console.error('Error checking availability:', error);
            // Send error message
            controller.enqueue(encoder.encode(
              `data: ${JSON.stringify({
                type: 'error',
                message: 'Failed to check availability after multiple retries'
              })}\n\n`
            ));
            controller.close();
            return;
          }
        }

        // Move to next day
        currentDate.add(1, 'day');
      }

      // Send no availability message
      controller.enqueue(encoder.encode(
        `data: ${JSON.stringify({
          type: 'no_availability',
          message: 'No available slots found within the next 2 months'
        })}\n\n`
      ));
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
} 