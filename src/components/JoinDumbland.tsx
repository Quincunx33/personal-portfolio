import React from "react";
import NidHub from "./NidHub";
import { Database } from "lucide-react";
import { motion } from "motion/react";

export default function JoinDumbland() {
  return (
    <motion.div
       initial={{ opacity: 0, y: 15 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.4 }}
       className="w-full min-h-screen"
    >
      <NidHub />
    </motion.div>
  );
}
