import React, { useEffect, useState } from 'react'

import { Header } from '../../components/Header';
import api from '../../services/api';
import { FoodComponent } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface Food {
  id: number
  name: string
  description: string
  price: string
  available: boolean
  image: string
}

export function Dashboard() {
  const [foods, setFoods] = useState<Food[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingFood, setEditingFood] = useState<Food>({} as Food)

  useEffect(() => {
    async function loadData() {
      await api.get('/foods').then(res => setFoods(res.data))
    }
  
    loadData()
  }, [])

  function toggleModal() {
    setIsModalOpen(!isModalOpen)
  }

  function toggleEditModal() {
    setIsEditModalOpen(!isEditModalOpen)
  }

  async function handleAddFood(food: Food) {
    try {
      await api.post('/foods', {
        ...food,
        available: true,
      }).then(res => setFoods(prevState => [...prevState, res.data]))

    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: Food) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    setFoods(foods.filter(food => food.id !== id));
  }

  function handleEditFood(food: Food) {
    setEditingFood(food)
    setIsEditModalOpen(true)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isEditModalOpen}
        toggleModal={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <FoodComponent
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
