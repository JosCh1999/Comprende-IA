
const { co2 } = require('@tgwf/co2');

// Inicializa el modelo de CO2 con el tipo de datos que quieres estimar.
// En este caso, usaremos 'swd' (Sustainable Web Design) para datos transferidos.
const co2Emission = new co2({ model: 'swd' });

/**
 * Estima las emisiones de CO2 para una cantidad de bytes transferidos.
 * @param {number} bytes - La cantidad de bytes a estimar.
 * @returns {number} Las emisiones estimadas en gramos de CO2.
 */
const estimateCo2 = (bytes) => {
  return co2Emission.perByte(bytes);
};

module.exports = {
  estimateCo2,
};
