import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { motion, useAnimation } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "./ui/button";

export const ServiceCard = ({ service, index }: { service: any; index: number }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, y: 0, transition: { delay: index * 0.3 } },
        hidden: { opacity: 0, y: 50 },
      }}
    >
      <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-[0_0_20px_rgba(184,255,79,0.5)] hover:ring-1 hover:ring-[#B8FF4F] hover:ring-offset-0 relative after:absolute after:inset-0 after:rounded-lg after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 after:shadow-[0_0_30px_4px_rgba(184,255,79,0.3)] after:pointer-events-none">
        <CardHeader>
          <div className="w-12 h-12 rounded-full bg-[#B8FF4F] flex items-center justify-center mb-4">
            <service.icon className="h-6 w-6 text-black" />
          </div>
          <CardTitle className="text-lg">{service.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{service.description}</CardDescription>
        </CardContent>
        <CardFooter>
          {service.comingSoon ? (
            <span className="text-sm text-muted-foreground">Coming Soon</span>
          ) : (
            <Button variant="ghost" className="w-full group">
              Learn More
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};
