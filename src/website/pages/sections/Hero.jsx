import { motion } from "framer-motion";
//import CountUp from "react-countup";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";

import { landingData } from "../../data/landingData";

/**
 * ==========================================================
 * Hero Section
 * ==========================================================
 *
 * Data Source:
 * landingData.hero
 *
 * Future:
 * Admin Panel → Website Management → Hero
 *
 * ==========================================================
 */

const Hero = () => {
  const { hero } = landingData;

  return (
    <section
      id="hero"
      className="
        pt-8
        pb-8
        lg:pt-10
        lg:pb-12
      "
    >
      <Container>
        <div
          className="
            grid
            lg:grid-cols-2
            gap-10
            lg:gap-12
            items-center
          "
        >
          {/* =====================================
              LEFT CONTENT
          ===================================== */}

          <div>
            {/* Premium Badge */}

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                inline-flex
                items-center
                gap-2
                px-5
                py-2.5
                mb-6
                rounded-full

                border
                border-zinc-800

                bg-zinc-900/80
                backdrop-blur-md

                shadow-lg
                shadow-black/20

                text-sm
                font-medium
                text-zinc-300
              "
            >
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-[#0C831F]
                "
              />

              {hero.badge}
            </motion.div>

            {/* Heading */}

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="
                text-4xl
                lg:text-5xl
                font-bold
                tracking-tight
                leading-[1]
              "
            >
              {hero.title}
            </motion.h1>

            {/* Description */}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="
                mt-6
                max-w-md
                text-base
                lg:text-lg
                leading-relaxed
                text-zinc-400
              "
            >
              {hero.description}
            </motion.p>

            {/* Buttons */}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="
                  mt-8

                  flex
                  flex-col
                  sm:flex-row

                  gap-4
                "
              >
                <Link
                  to="/register"
                  className="flex-1"
                >
                  <Button className="w-full">
                    Become A Member
                  </Button>
                </Link>

                <a
                  href="#get-invited"
                  className="flex-1"
                >
                  <Button
                    variant="secondary"
                    className="w-full"
                  >
                    Get Invited
                  </Button>
                </a>
              </motion.div>
            {/* Animated Statistics */}

            <div
            className="
                grid
                grid-cols-3
                gap-8
                mt-16
            "
            >
            {hero.stats.map((item) => (
                <div key={item.label}>
                <h3
                    className="
                    text-2xl
                    font-bold
                    "
                >
                    {item.value}
                </h3>

                <p
                    className="
                    mt-1
                    text-sm
                    text-zinc-500
                    "
                >
                    {item.label}
                </p>
                </div>
            ))}
            </div>
              
          </div>

              {/* =====================================
                  RIGHT VISUAL
              ===================================== */}

              <div>
                <div
                  className="
                    relative
                    h-[400px]
                    rounded-3xl
                    overflow-hidden

                    border
                    border-zinc-800

                    bg-zinc-900

                    shadow-xl
                    shadow-black/20
                  "
                >
                  <img
                    src={hero.image}
                    alt="MCN Networking Community"
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0

                      bg-gradient-to-t
                      from-black/40
                      via-black/10
                      to-transparent
                    "
                  />
                </div>
              </div>

            </div> {/* <-- closes grid container */}

          </Container>
        </section>
      );
    };

export default Hero;