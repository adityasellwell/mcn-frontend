import { motion } from "framer-motion";

import Container from "../../components/ui/Container";
import StepCard from "../../components/ui/StepCard";

import { landingData } from "../../data/landingData";
/**
 * ==================================================
 * How It Works Section
 * ==================================================
 */

const HowItWorks = () => {
  const { howItWorks } = landingData;

  return (
    <section
      className="
        py-12
        lg:py-16
      "
    >
      <Container>
        {/* Heading */}

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
              font-medium
            "
          >
            HOW IT WORKS
          </span>

          <h2
            className="
              mt-6
              text-4xl
              lg:text-6xl
              font-bold
              tracking-tight
            "
          >
            {howItWorks.title}
          </h2>

          <p
            className="
              mt-6
              text-lg
              text-zinc-400
              leading-relaxed
            "
          >
            {howItWorks.subtitle}
          </p>
        </motion.div>

        {/* Steps */}

        <div
          className="
            grid
            md:grid-cols-2
            gap-8
            mt-12
          "
        >
          {howItWorks.steps.map(
            (step, index) => (
              <motion.div
                key={step.number}
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
                <StepCard
                  number={step.number}
                  title={step.title}
                  description={
                    step.description
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

export default HowItWorks;