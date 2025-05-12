import React, { useEffect, useRef } from 'react';
import './DinosaurModal.css';
import { Dinosaur } from '../../types/Dinosaur';

interface Props {
  dino: Dinosaur | null;
  isOpen: boolean;
  onClose: () => void;
}

const DinosaurModal: React.FC<Props> = ({ dino, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen || !dino) return null;

  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        ref={modalRef}
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          aria-label="Fermer"
          onClick={onClose}
        >&times;</button>
        <h2>Détails du dinosaure</h2>
        <ul>
          <li><strong>ID :</strong> {dino.id}</li>
          <li><strong>Nom :</strong> {dino.name}</li>
          <li><strong>Régime :</strong> {cap(dino.diet.name)}</li>
          <li><strong>Énergie :</strong> {dino.energy}</li>
          <li><strong>Nourriture :</strong> {dino.food}</li>
          <li><strong>XP :</strong> {dino.experience}</li>
          <li><strong>Époque :</strong> {cap(dino.epoch)}</li>
          <li><strong>Créé le :</strong> {new Date(dino.created_at).toLocaleDateString()}</li>
        </ul>
      </div>
    </div>
  );
};

export default DinosaurModal;
