import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'
import { sendEmail, emailTemplates } from '../../lib/email'

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json()
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }
    
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase configuration missing')
      return NextResponse.json(
        { error: 'Database configuration missing. Please check your environment variables.' },
        { status: 500 }
      )
    }
    
    // Insert article into database
    const { data, error } = await supabase
      .from('articles')
      .insert([
        {
          title: body.title,
          author_name: body.author_name,
          agency_contact: body.agency_contact,
          kol_name: body.kol_name,
          kol_credentials: body.kol_credentials,
          body: body.body,
          therapeutic_area: body.therapeutic_area,
          target_audience: body.target_audience,
          article_type: body.article_type,
          image_url: body.image_url,
          interview_package: body.interview_package || 'basic',
          payment_status: body.payment_status || 'pending',
          status: 'pending_review'
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    // If interview package is selected, create interview record
    if (body.interview_package && body.interview_package !== 'basic' && body.interview_date && body.interview_time) {
      const scheduledDateTime = new Date(`${body.interview_date}T${body.interview_time}`);
      
      await supabase
        .from('interviews')
        .insert([
          {
            article_id: data.id,
            scheduled_time: scheduledDateTime.toISOString(),
            duration: body.interview_package === 'premium' ? 15 : 30,
            payment_status: 'pending'
          }
        ])
      .select()
      .single();
    }

    // Send confirmation email
    try {
      const emailTemplate = emailTemplates.articleSubmission(body.title, body.author_name)
      await sendEmail({
        to: body.agency_contact,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      })
    } catch (emailError) {
      console.error('Email error:', emailError)
      // Don't fail the request if email fails
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
    const status = searchParams.get('status')
    
    let query = supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch articles' },
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
