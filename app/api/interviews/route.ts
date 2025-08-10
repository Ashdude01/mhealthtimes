import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'
import { sendEmail, emailTemplates } from '../../lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Insert interview into database
    const { data, error } = await supabase
      .from('interviews')
      .insert([
        {
          article_id: body.articleId,
          kol_id: body.kolId,
          scheduled_time: body.scheduledTime,
          duration: body.duration,
          payment_status: 'pending'
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create interview booking' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, payment_status } = body
    
    // Update interview payment status
    const { data, error } = await supabase
      .from('interviews')
      .update({ payment_status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update interview' },
        { status: 500 }
      )
    }

    // If payment is successful, send confirmation email
    if (payment_status === 'paid') {
      try {
        // Get article details for email
        const { data: articleData } = await supabase
          .from('articles')
          .select('kol_name, agency_contact')
          .eq('id', data.article_id)
          .single()

        if (articleData) {
          const emailTemplate = emailTemplates.interviewBooking(
            articleData.kol_name,
            data.scheduled_time,
            data.duration
          )
          
          await sendEmail({
            to: articleData.agency_contact,
            subject: emailTemplate.subject,
            html: emailTemplate.html
          })
        }
      } catch (emailError) {
        console.error('Email error:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const articleId = searchParams.get('articleId')
    
    let query = supabase
      .from('interviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (articleId) {
      query = query.eq('article_id', articleId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch interviews' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
