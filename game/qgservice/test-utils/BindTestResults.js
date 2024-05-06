const monumentTestData = {
    results: {
      bindings: [
        { monumentLabel: { value: 'Eiffel Tower' }, countryLabel: { value: 'France' } },
        { monumentLabel: { value: 'Taj Mahal' }, countryLabel: { value: 'India' } },
        { monumentLabel: { value: 'Statue of Liberty' }, countryLabel: { value: 'United States' } },
        { monumentLabel: { value: 'Great Wall of China' }, countryLabel: { value: 'China' } }
      ]
    }
  };

const chemicalTestData = {
    results: {
      bindings: [
        { elementLabel: { value: 'Oxygen' }, symbol: { value: 'O' } },
        { elementLabel: { value: 'Hydrogen' }, symbol: { value: 'H' } },
        { elementLabel: { value: 'Carbon' }, symbol: { value: 'C' } },
        { elementLabel: { value: 'Nitrogen' }, symbol: { value: 'N' } }
      ]
    }
};

const capitalTestData = {
    results: {
      bindings: [
        { countryLabel: { value: 'France' }, capitalLabel: { value: 'Paris' } },
        { countryLabel: { value: 'Germany' }, capitalLabel: { value: 'Berlin' } },
        { countryLabel: { value: 'Italy' }, capitalLabel: { value: 'Rome' } },
        { countryLabel: { value: 'Spain' }, capitalLabel: { value: 'Madrid' } }
      ]
    }
  };

  const populationTestData = {
    results: {
      bindings: [
        { cityLabel: { value: 'Tokyo' }, population: { value: '13929286' } },
        { cityLabel: { value: 'Delhi' }, population: { value: '18978000' } },
        { cityLabel: { value: 'Shanghai' }, population: { value: '24150000' } },
        { cityLabel: { value: 'Madrid' }, population: { value: '3550000' } }
      ]
    }
  };

  module.exports = { monumentTestData, chemicalTestData, capitalTestData, populationTestData };