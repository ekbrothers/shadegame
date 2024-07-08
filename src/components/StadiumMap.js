
import React from 'react';

const StadiumMap = ({ stadium }) => {
  const { sections } = stadium.seatingChart;

  return (
    <div>
      <h2>{stadium.stadium} Seating Chart</h2>
      <div style={{ display: 'flex' }}>
        {sections.map(section => (
          <div
            key={section.id}
            style={{
              padding: '10px',
              margin: '5px',
              border: '1px solid black',
              backgroundColor:
                section.sun === 'full'
                  ? 'yellow'
                  : section.sun === 'partial'
                  ? 'orange'
                  : 'lightgrey',
            }}
          >
            {section.id} - {section.sun}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StadiumMap;
