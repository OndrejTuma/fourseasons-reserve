import { NextResponse } from 'next/server';
import axios from 'axios';
import moment from 'moment';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = searchParams.get('days')?.split(',').map(Number) || [];
  const time = searchParams.get('time') || '19:00';

  // Get current date
  let currentDate = moment();
  const maxDate = moment().add(2, 'months');

  while (currentDate.isBefore(maxDate)) {
    // Check if current day is in selected days
    const currentDay = currentDate.day();
    if (days.includes(currentDay)) {
      // Format the date and time for the API
      const dateTime = moment(currentDate).format('YYYY-MM-DD') + 'T' + time;

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
          }
        });

        if (response.data.times_available !== null) {
          return NextResponse.json({
            success: true,
            date: currentDate.format('YYYY-MM-DD'),
            time: time,
            data: response.data
          });
        }
      } catch (error) {
        console.error('Error checking availability:', error);
        return NextResponse.json(
          { error: 'Failed to check availability' },
          { status: 500 }
        );
      }
    }

    // Move to next day
    currentDate.add(1, 'day');
  }

  return NextResponse.json({
    success: false,
    message: 'No available slots found within the next 2 months'
  });
} 