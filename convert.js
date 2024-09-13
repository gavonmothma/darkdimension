// Import the fs module to read files (not needed if using `import` syntax)
const fs = require('fs');

// Function to read and parse a JSON file
function readJsonFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
}


function convertToUsable(data) {
  masterUsableData = []
  temp = data.MissionDetails;
  temp.forEach(mission => {
    usableData = [];
    usableData.push(mission.ID)
    mission.Settings[1].WaveLists.forEach(waveeee => {
      waves = 1;
      waveeee.Waves.forEach(entries => {
        usableData.push("Wave " + waves++, "TurnSpeed: " + entries.TurnSpeed, "MaxSlotFill: " + entries.MaxSlotFill,  "MinSlotReq: " + entries.MinSlotReq)
        waveEntries = [];
        entries.Entries.forEach(hero => {
          startingEnergy = null
          if (hero.desired_starting_ability_energy) {
            startingEnergy = "Energy: " + hero.desired_starting_ability_energy[0] + " " + hero.desired_starting_ability_energy[1]
          }
          abilityCost = null
          if (hero.desired_ability_cost) {
            abilityCost = "AbilityCost: " + hero.desired_ability_cost[0] + " " + hero.desired_ability_cost[1]
          }
          properties = []
          properties.push(startingEnergy || '', abilityCost || '', "ISO: " + hero.iso_skill_id)
          waveEntries.push(hero.hero_id, properties	)
        })
        usableData.push(waveEntries)
      })
    })

    masterUsableData.push(usableData)  
  })
  
  console.log(masterUsableData)
  return masterUsableData;
}

// Example usage
(async () => {
  try {
    const data = await readJsonFile('./Insanity070MissionDetails.json');
    
    const updatedData = convertToUsable(data)
    
    // Write the updated data back to a file
    fs.writeFile('./converted.json', JSON.stringify(updatedData, null, 2), err => {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log('File successfully updated!');
      }
    });

  } catch (error) {
    console.error('Error:', error);
  }
})();
