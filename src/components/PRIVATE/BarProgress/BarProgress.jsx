/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import './barProgress.scss';
import { useSelector } from 'react-redux';

const BarProgress = ({ cantActual, meta }) => {
  const [goalAmount, setGoalAmount] = useState(0);
  const [progressAmount, setProgressAmount] = useState(0);

  // const infoMetas = useSelector((state) => state.metas.infoMetas);

  const cicleInit = () => {
    const fondo = document.querySelector('.background');
    const track = document.querySelector('.track');
    const base = document.querySelector('.base');
    const progress = document.querySelector('.progress');

    const trackHeight = parseInt(window.getComputedStyle(track).height, 10);
    const baseHeight = parseInt(window.getComputedStyle(base).height, 10);
    // Porcentaje actual que esta ocupando el total de pedidos
    const porcentaje = (progressAmount / goalAmount) * 100;

    // Porcentaje total que cubre el circulo
    const pT_cubreCiculo = (baseHeight / trackHeight) * 100;

    // Porcentaje que ocupa el pintando en la barra grande
    const valorPorcentajeBarraGrande = (porcentaje / 100) * trackHeight;

    // // Porcentaje que ocupa el pintando en la barra pequeña
    const porcentajeEnBarraPequena = (valorPorcentajeBarraGrande / baseHeight) * 100;

    if (porcentaje > pT_cubreCiculo / 2) {
      progress.style.backgroundColor = '#21d521 ';
    } else {
      progress.style.backgroundColor = '#21d52100';
    }
    fondo.style.height = `calc(${porcentajeEnBarraPequena}%)`;
  };

  const thermometer = () => {
    const thermo = document.getElementById('thermometer');
    const progress = thermo.querySelector('.progress');
    const goal = thermo.querySelector('.goal');
    let percentageAmount;

    percentageAmount = Math.min(Math.round((progressAmount / goalAmount) * 1000) / 10, 100);

    goal.querySelector('.amount').textContent = `Meta : ${meta}`;
    progress.querySelector('.amount').textContent = `Pedidos : ${progressAmount}`;
    progress.querySelector('.amount').style.display = 'none';
    progress.style.height = percentageAmount + '%';

    setTimeout(() => {
      progress.querySelector('.amount').style.display = 'block !important';
    }, 1200);
  };

  useEffect(() => {
    thermometer();
    cicleInit();
  }, [progressAmount, goalAmount]);

  useEffect(() => {
    setProgressAmount(cantActual);
    setGoalAmount(meta);
  }, [cantActual, meta]);

  return (
    <div id="thermometer">
      <div className="track">
        <div className="goal">
          <div className="amount" />
        </div>
        <div className="progress">
          <div className="amount" />
        </div>
        <span>{progressAmount}</span>
        <div className="base">
          <div className="background" />
        </div>
      </div>
    </div>
  );
};

export default BarProgress;
