
const BtnPagar = () => {
  const handleClick = () => {
    console.log('Se ha cancelado el pago');
  };

  return (
    <button onClick={handleClick} className='active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01]  ease-in-out transform py-2 rounded-xl text-white font-bold text-lg bg-verde'>
      Cancelar Pago
    </button>
  );
};

export default BtnPagar;
