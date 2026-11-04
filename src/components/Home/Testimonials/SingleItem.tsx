import React from "react";
import Image from "next/image";

interface FeedbackItem {
  id: number;
  name: string;
  img: string;
  description: string;
}

const SingleItem = ({ testimonial }: { testimonial: FeedbackItem }) => {
  return (
    <div className="shadow-testimonial bg-white rounded-[10px] py-7.5 px-4 sm:px-8.5 m-1">
      <div className="flex items-center gap-1 mb-5">
        <Image
          src="/images/icons/icon-star.svg"
          alt="star icon"
          width={15}
          height={15}
        />
        <Image
          src="/images/icons/icon-star.svg"
          alt="star icon"
          width={15}
          height={15}
        />
        <Image
          src="/images/icons/icon-star.svg"
          alt="star icon"
          width={15}
          height={15}
        />
        <Image
          src="/images/icons/icon-star.svg"
          alt="star icon"
          width={15}
          height={15}
        />
        <Image
          src="/images/icons/icon-star.svg"
          alt="star icon"
          width={15}
          height={15}
        />
      </div>

      {/* Database wala description (Review text) */}
      <p className="text-dark mb-6">{testimonial.description}</p>

      <div className="flex items-center gap-4">
        <div className="w-12.5 h-12.5 rounded-full overflow-hidden relative">
          <Image
            src={testimonial.img}
            alt={testimonial.name}
            fill
            className="object-cover rounded-full"
          />
        </div>

        <div>
          {/* Database wala name */}
          <h3 className="font-medium text-dark">{testimonial.name}</h3>
          <p className="text-custom-sm text-gray-500">Verified Customer</p>
        </div>
      </div>
    </div>
  );
};

export default SingleItem;