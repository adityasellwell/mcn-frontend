import { motion } from "framer-motion";

import Container from "../../components/ui/Container";

import { landingData } from "../../data/landingData";

const ChapterOverview = () => {
  const { chapter } = landingData;

  return (
    <section
      id="chapter"
      className="
        py-12
        lg:py-16
      "
    >
      <Container>
        <div
          className="
            grid
            lg:grid-cols-2
            gap-16
            items-center
          "
        >
          {/* Left */}

          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
          >
            <span
              className="
                text-sm
                uppercase
                tracking-[0.3em]
                text-zinc-500
              "
            >
              CHAPTER
            </span>

            <h2
              className="
                mt-6
                text-4xl
                lg:text-6xl
                font-bold
              "
            >
              {chapter.title}
            </h2>

            <p
              className="
                mt-6
                text-lg
                text-zinc-400
                leading-relaxed
              "
            >
              {chapter.subtitle}
            </p>

            <div
              className="
                grid
                grid-cols-3
                gap-8
                mt-10
              "
            >
              {chapter.stats.map((item) => (
                <div key={item.label}>
                  <h3
                    className="
                      text-3xl
                      font-bold
                    "
                  >
                    {item.value}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-zinc-500
                    "
                  >
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
          >
            <div
              className="
                overflow-hidden
                rounded-3xl

                border
                border-zinc-800
              "
            >
              <img
                src={chapter.image}
                alt={chapter.title}
                className="
                  w-full
                  h-[500px]
                  object-cover
                "
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default ChapterOverview;