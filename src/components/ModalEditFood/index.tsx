import React, { useRef } from 'react';
import { FiCheckSquare } from 'react-icons/fi';

import { Form } from './styles';
import { Modal } from '../Modal';
import Input from '../Input';

interface Food {
  id: number
  name: string
  description: string
  price: string
  available: boolean
  image: string
}

interface ModalEditFoodProps {
  isOpen: boolean
  toggleModal: () => void
  handleUpdateFood: (arg0: Food) => Promise<void>
  editingFood: Food
}

export function ModalEditFood({ 
  isOpen,
  toggleModal,
  handleUpdateFood,
  editingFood
}: ModalEditFoodProps) {
  const formRef = useRef(null)

  async function handleSubmit(data: Food) {
    handleUpdateFood(data);
    toggleModal();
  };

  return (
    <Modal isOpen={isOpen} toggleModal={toggleModal}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
}
