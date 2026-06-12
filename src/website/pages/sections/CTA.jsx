import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import Container from "../../components/ui/Container";

import Button from "../../components/ui/Button";

import { landingData } from "../../data/landingData";

/**
 * ==================================================
 * CTA Section
 * ==================================================
 *
 * Future:
 * Admin Controlled
 *
 * ==================================================
 */

const CTA = () => {
  const { cta } = landingData;

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
            relative

            overflow-hidden

            rounded-[32px]

            border
            border-zinc-800

            bg-zinc-900

            px-8
            py-16

            lg:px-16
            lg:py-20

            text-center
          "
        >
          {/* Green Glow */}

          <div
            className="
              absolute
              top-0
              left-1/2

              h-72
              w-72

              -translate-x-1/2

              rounded-full

              bg-[#0C831F]/20

              blur-[120px]
            "
          />

          <div className="relative z-10">
            <h2
              className="
                text-4xl
                lg:text-6xl

                font-bold
                tracking-tight
              "
            >
              {cta.title}
            </h2>

            <p
              className="
                mt-6

                max-w-2xl
                mx-auto

                text-zinc-400
                text-lg
                leading-relaxed
              "
            >
              {cta.subtitle}
            </p>

            <div
              className="
                mt-10

                flex
                flex-col
                sm:flex-row

                justify-center

                gap-4
              "
            > 
              <Link
                to="/register"
                className="w-full sm:w-auto"
              >
                <Button className="w-full">
                  {cta.primaryButtonText}
                </Button>
              </Link>  
              <a
                href="#get-invited"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="secondary"
                  className="w-full"
                >
                  {cta.secondaryButtonText}
                </Button>
              </a>
              
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default CTA;