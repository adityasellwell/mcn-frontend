const TestimonialCard = ({
  testimonial,
}) => {
  return (
    <div
      className="
        p-8

        rounded-3xl

        border
        border-zinc-800

        bg-zinc-900

        transition-all
        duration-300

        hover:border-[#0C831F]
      "
    >
      <p
        className="
          text-zinc-300
          leading-relaxed
        "
      >
        "{testimonial.testimonial}"
      </p>

      <div className="mt-6">
        <h4
          className="
            font-semibold
          "
        >
          {testimonial.name}
        </h4>

        <p
          className="
            text-sm
            text-zinc-500
          "
        >
          {testimonial.company}
        </p>
      </div>
    </div>
  );
};

export default TestimonialCard;