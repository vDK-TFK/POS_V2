
const ListaClientes = () => {
    const clientes = [
      { id: 1, nombre: 'Francisco Araya' },
      { id: 2, nombre: 'Josué Bonilla' },
      { id: 3, nombre: 'Yaritza Macotelo' },
      { id: 4, nombre: 'Manfred Villegas' },
    ];
  
    const handleOnChange = (event) => {
      const selectedClientId = parseInt(event.target.value);
      console.log('Cliente seleccionado:', selectedClientId);
    };
  
    return (
      <div className='flex flex-col pb-8 mt-4 px-12'>
        <label htmlFor="clienteSelect">Selecciona un cliente:</label>
        <select id="clienteSelect" onChange={handleOnChange}>
          <option value="">Seleccionar cliente</option>
          {clientes.map(cliente => (
            <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
          ))}
        </select>
      </div>
    );
  };
  
  export default ListaClientes;
  