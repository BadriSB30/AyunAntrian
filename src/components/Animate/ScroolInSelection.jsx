import { motion } from 'framer-motion';

export default function ScrollInSection({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 1 }}
      viewport={{ amount: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
