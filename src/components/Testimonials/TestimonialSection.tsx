'use client'

import { Testimonial } from '@/lib/types'
import { useRef, useState } from 'react'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import SectionHeading from '../SectionHeading/SectionHeading'
import TestimonialCard from './TestimonialCard'

interface TestimonialSectionProps {
  testimonials: Testimonial[]
}

const TestimonialSection: React.FC<TestimonialSectionProps> = ({ testimonials }) => {
  const [activeCard, setActiveCard] = useState(0)
  const scrollContainer = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const scrollAmount = direction === 'left' ? -300 : 300
      scrollContainer.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section id="testimonials">
      <div className="flex items-end justify-between">
        <SectionHeading
          title="// Testimonials"
          subtitle="Don't just take our word for it - see what actual users of our service have to say about their experience."
        />
        <div className="hidden items-center gap-4 sm:flex">
          <button
            className="bg-accent-dark hover:bg-accent-dark/80 grid size-12 place-items-center rounded-full"
            onClick={() => scroll('left')}
          >
            <BsArrowLeft />
          </button>
          <button
            className="bg-accent-dark hover:bg-accent-dark/80 grid size-12 place-items-center rounded-full"
            onClick={() => scroll('right')}
          >
            <BsArrowRight />
          </button>
        </div>
      </div>

      <div ref={scrollContainer} className="hide-scrollbar my-8 flex gap-8 overflow-x-auto">
        {testimonials.map((testimonial, idx) => (
          <TestimonialCard
            key={idx}
            testimonial={testimonial}
            handleActiveCard={() => {
              setActiveCard(idx)
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-1 sm:hidden">
        {testimonials.map((_, idx) => (
          <div
            key={idx}
            className={`${idx === activeCard ? 'bg-accent size-[12px]' : 'size-[10px] bg-white/50'} rounded-full`}
          />
        ))}
      </div>
    </section>
  )
}

export default TestimonialSection
