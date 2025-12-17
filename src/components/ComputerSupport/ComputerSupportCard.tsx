import React, { SVGProps } from 'react';

interface ComputerSupportCardProps {
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  shortDescription: string;
}

const ComputerSupportCard: React.FC<ComputerSupportCardProps> = ({ icon: Icon, title, shortDescription }) => {
  return (
    <div className="bg-secondary border-border flex flex-col items-center rounded-[14px] border p-5">
      <Icon className="my-1 size-14" />
      <h5 className="text-accent mt-2 mb-5 text-center text-base font-semibold">{title}</h5>
      <div className="bg-primary rounded-2xl p-4">
        <p className="text-primary-content text-center text-sm font-normal">{shortDescription}</p>
      </div>
    </div>
  );
};

export default ComputerSupportCard;
