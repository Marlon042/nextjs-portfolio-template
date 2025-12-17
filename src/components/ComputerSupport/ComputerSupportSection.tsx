import { computerSupportData } from '../../appData'
import SectionHeading from '../SectionHeading/SectionHeading'
import ComputerSupportCard from './ComputerSupportCard'

const ComputerSupportSection = () => {
  return (
    <section id="computer-support" className="my-14">
      <SectionHeading
        title=""
        subtitle=""
      />

      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 md:mt-[3.75rem] md:grid-cols-3">
        {computerSupportData.map((service, index) => (
          <ComputerSupportCard
            key={index}
            icon={service.icon}
            title={service.title}
            shortDescription={service.shortDescription}
          />
        ))}
      </div>
    </section>
  )
}

export default ComputerSupportSection
