import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, CalendarOff } from "lucide-react";

import Container from "../../components/ui/Container";
import MeetingCard from "../../components/ui/MeetingCard";
import Button from "../../components/ui/Button";
import api from "../../../services/api";

const MeetingsPreview = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeetings = async () => {
      try {
        const response = await api.get("/meeting/website");
        setMeetings(response.data?.data || []);
      } catch (err) {
        console.error("MeetingsPreview: failed to load meetings", err);
        setMeetings([]);
      } finally {
        setLoading(false);
      }
    };
    loadMeetings();
  }, []);

  return (
    <section
      id="meetings"
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
            MEETINGS
          </span>

          <h2
            className="
              mt-6
              text-4xl
              lg:text-6xl
              font-bold
            "
          >
            Join The Next Networking Event
          </h2>

          <p
            className="
              mt-6
              text-lg
              text-zinc-400
              leading-relaxed
            "
          >
            Attend structured networking meetings, build relationships, and grow
            through referrals.
          </p>
        </motion.div>

        {/* Meeting Cards */}
        <div className="mt-12">
          {loading ? (
            /* Loading Skeleton */
            <div className="flex items-center justify-center py-16 gap-3 text-zinc-500">
              <Loader2 size={24} className="animate-spin" />
              <span>Loading meetings...</span>
            </div>
          ) : meetings.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-500">
              <CalendarOff size={36} />
              <p className="text-sm text-center">
                No meetings available at the moment. Check back soon!
              </p>
            </div>
          ) : (
            <div
              className="
                grid
                md:grid-cols-2
                gap-8
              "
            >
              {meetings.map((meeting, index) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MeetingCard meeting={meeting} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* View All Meetings — scrolls to meetings section */}
        {!loading && meetings.length > 1 && (
          <div className="mt-12 text-center">
            <a href="/#meetings">
              <Button variant="secondary">View All Meetings</Button>
            </a>
          </div>
        )}
      </Container>
    </section>
  );
};

export default MeetingsPreview;
