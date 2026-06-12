import { motion } from "framer-motion";

import Container from "../../components/ui/Container";
import FeatureCard from "../../components/ui/FeatureCard";

import { landingData } from "../../data/landingData";

const AboutMCN = () => {
  const { about } = landingData;

  return (
    <section
      id="about"
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
              text-[#0C831F]
              font-bold
            "
          >
            ABOUT MCN
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
            Built For Business Growth
          </h2>

          <p
            className="
              mt-8
              text-lg
              leading-relaxed
              text-zinc-400
            "
          >
            {about.subtitle}
          </p>
        </motion.div>

        <div
          className="
            grid
            md:grid-cols-2
            gap-8
            mt-12
          "
        >
          {about.features.map(
            (feature, index) => (
              <motion.div
                key={feature.title}
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
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={
                    feature.description
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

export default AboutMCN;