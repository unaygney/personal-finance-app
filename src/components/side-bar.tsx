"use client";
import React from "react";
import { motion } from "framer-motion";
import { set } from "zod";
export default function SideBar() {
  const [isActive, setActive] = React.useState<boolean>(false);

  const toggle = () => setActive(!isActive);
  return (
    <motion.div
      initial={{
        width: "80px",
      }}
      animate={{
        width: isActive ? "300px" : "80px",
      }}
      transition={{ duration: 0.3 }}
      className="max-w-[300px] h-screen w-full bg-grey-900 rounded-r-lg text-grey-300"
    >
      SideBar
      <button onClick={toggle}>aç / kapa</button>
    </motion.div>
  );
}
