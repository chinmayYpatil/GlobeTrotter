import React from 'react';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';

const GoogleSignInButton = ({ onClick, text = "Continue with Google" }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm"
    >
      <FcGoogle className="h-5 w-5" />
      <span>{text}</span>
    </motion.button>
  );
};

export default GoogleSignInButton;
