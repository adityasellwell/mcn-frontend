import Layout from "../layouts/Layout";
import Hero from "./sections/Hero";
import CommunitySlider from "../components/ui/CommunitySlider";
import AboutMCN from "./sections/AboutMCN";
import HowItWorks from "./sections/HowItWorks";
import ChapterOverview from "./sections/ChapterOverview";
import MeetingsPreview from "./sections/MeetingsPreview";
import GetInvited from "./sections/GetInvited";
import Testimonials from "./sections/Testimonials";
import CTA from "./sections/CTA";
import Contact from "./sections/Contact";
import usePageTitle from "../../hooks/usePageTitle";
const Home = () => {

usePageTitle(
  "MCN | Muslim Community Network"
);

  return (
    <Layout>
       <Hero />
       <CommunitySlider />
       <AboutMCN />
       <HowItWorks />
       <ChapterOverview />
       <MeetingsPreview /> 
        <GetInvited />
       <Testimonials />
       <CTA />
       <Contact />
    </Layout>
  );
};

export default Home;
     