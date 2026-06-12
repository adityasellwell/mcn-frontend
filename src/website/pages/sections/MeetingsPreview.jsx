import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import Container from "../../components/ui/Container";
import MeetingCard from "../../components/ui/MeetingCard";
import Button from "../../components/ui/Button";

import { landingData } from "../../data/landingData";

const MeetingsPreview = () => {
const { meetings } = landingData;

return ( <section
   id="meetings"
   className="
     py-12
     lg:py-16
   "
 > <Container>
{/* Heading */}

```
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
        UPCOMING MEETINGS
      </span>

      <h2
        className="
          mt-6
          text-4xl
          lg:text-6xl
          font-bold
        "
      >
        {meetings.title}
      </h2>

      <p
        className="
          mt-6
          text-lg
          text-zinc-400
          leading-relaxed
        "
      >
        {meetings.subtitle}
      </p>
    </motion.div>

    {/* Meeting Cards */}

    <div
      className="
        grid
        md:grid-cols-2
        gap-8
        mt-12
      "
    >
      {meetings.items.map(
        (meeting, index) => (
          <motion.div
            key={meeting.id}
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
            <MeetingCard
              meeting={meeting}
            />
          </motion.div>
        )
      )}
    </div>
  </Container>
</section>

);
};

export default MeetingsPreview;
