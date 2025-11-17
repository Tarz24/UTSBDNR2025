import React from 'react';
import './WhatsAppButton.css';

function WhatsAppButton({ phoneNumber = "6281234567890", text = "Tanya Pamela" }) {
  const whatsappUrl = `https://wa.me/${phoneNumber}`;
  
  return (
    <a 
      href={whatsappUrl} 
      className="whatsapp-float" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <span className="whatsapp-icon">💬</span>
      <span className="whatsapp-text">{text}</span>
    </a>
  );
}

export default WhatsAppButton;
