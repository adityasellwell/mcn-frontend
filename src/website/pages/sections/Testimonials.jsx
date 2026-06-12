import { motion } from "framer-motion";

import Container from "../../components/ui/Container";
import TestimonialCard from "../../components/ui/TestimonialCard";

import { landingData } from "../../data/landingData";

const Testimonials = () => {
  const { testimonials } = landingData;

  return (
    <section
      className="
        py-12
        lg:py-16
      "
    >
      <Container>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="
            text-center
            max-w-4xl
            mx-auto
          "
        >
          <span
            className="
              text-sm
              uppercase
              tracking-[0.3em]
              text-zinc-500
            "
          >
            MEMBER STORIES
          </span>

          <h2
            className="
              mt-6
              text-4xl
              lg:text-6xl
              font-bold
            "
          >
            What Members Say
          </h2>

          <p
            className="
              mt-6
              text-lg
              text-zinc-400
            "
          >
            Hear from professionals and
            business owners growing
            through MCN.
          </p>
        </motion.div>

        <div
          className="
            grid
            lg:grid-cols-3
            gap-8
            mt-12
          "
        >
          {testimonials.map(
            (testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.1,
                }}
              >
                <TestimonialCard
                  testimonial={
                    testimonial
                  }
                />
              </motion.div>
            )
          )}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;