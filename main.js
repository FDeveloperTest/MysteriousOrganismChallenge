// Returns a random DNA base
const returnRandBase = () => {
  const dnaBases = ["A", "T", "C", "G"];
  return dnaBases[Math.floor(Math.random() * 4)];
};

// Returns a random single strand of DNA containing 15 bases
const mockUpStrand = () => {
  const newStrand = [];
  for (let i = 0; i < 15; i++) {
    newStrand.push(returnRandBase());
  }
  return newStrand;
};

//Factory function to create instances of pAequors
const pAequorFactory = (specimenNum, dna) => {
  return {
    specimenNum,
    dna,
    mutate() {
      //select random base of dna and change it
      let randIndex = Math.floor(Math.random() * this.dna.length);
      let randNewDna = returnRandBase();
      while (this.dna[randIndex] === randNewDna) {
        randIndex = Math.floor(Math.random() * this.dna.length);
      } //change only after new and old dna are not equal
      this.dna[randIndex] = randNewDna;
      return this.dna;
    },
    compareDNA(otherAequor) {
      let adder = 100 / 15; //100% / 15 bases
      let totalPercentage = 0;
      for (let i = 0; i < 15; i++) {
        if (this.dna[i] === otherAequor.dna[i]) {
          //if bases are equal, add 15%
          totalPercentage += adder;
        }
      }
      totalPercentage = totalPercentage.toFixed(2); // round up
      // console.log(
      //   `specimen #${this.specimenNum} and specimen #${otherAequor.specimenNum} have ${totalPercentage}% DNA in common.`
      // );
      return totalPercentage;
    },
    willLikelySurvive() {
      //60% is 9x minimum C or G bases.
      let cAndGBases = this.dna.filter((base) => base === "C" || base === "G"); //checks c and g bases
      return cAndGBases.length >= 9 ? true : false;
    },
    complementStrand(dnaBase) {
      //Creates complementary DNA base
      let complementDnaBase = [];
      dnaBase.forEach((base) => {
        if (base === "T") {
          complementDnaBase.push("A");
        } else if (base === "A") {
          complementDnaBase.push("T");
        } else if (base === "G") {
          complementDnaBase.push("C");
        } else {
          complementDnaBase.push("G");
        }
      });
      return complementDnaBase;
    },
  };
};

//Filter only pAequor's that surive and place them in an array
const filterSurvivers = () => {
  let survivors = []; //array to save survivors
  let unfiltArray = []; //array to save all instances
  let i = 0; //iterator
  while (survivors.length < 30) {
    unfiltArray.push(pAequorFactory(i, mockUpStrand())); //create new instance
    if (unfiltArray[i].willLikelySurvive() === true) {
      //if instance will survive, push into survivors array
      survivors.push(unfiltArray[i]);
    }
    i++;
  }
  return survivors;
};

//Array of 30 survivers
let survivers = filterSurvivers();

// Get closest two instances of a given array
const getClosestInstances = (array) => {
  let num1Rel = 0; //holds highest percentage for closest instances
  let num1 = ""; //String holds specimen numbers of closest instances
  let num2Rel = 0; //holds highest percentage for 2nd closest instance
  let num2 = ""; //String holds specimen numbers of 2nd closest instances
  for (let i1 = 0; i1 < array.length; i1++) {
    for (let i2 = 0; i2 < array.length; i2++) {
      //compare all possible combinations
      if (i1 !== i2) {//don't compare same instances with each other
        if (array[i1].compareDNA(array[i2]) > num1Rel) { //if percentage of relation is higher than current num1
          num1Rel = array[i1].compareDNA(array[i2]); //overwrite highest percentage
          num1 = `Specimens #${array[i1].specimenNum} and #${array[i2].specimenNum} are the most related instances.`; //overwrite string variable.
        } else if ( //same happens for 2nd closest instances
          array[i1].compareDNA(array[i2]) > num2Rel &&
          num1.includes(array[i1].specimenNum) === false &&
          num1.includes(array[i2].specimenNum) === false 
          //only loop if both specimen are not already the closest (num1)
        ) {
          num2Rel = array[i1].compareDNA(array[i2]);
          num2 = `Specimens #${array[i1].specimenNum} and #${array[i2].specimenNum} are the second most related instances.`;
        }
      }
    }
  }
  let result = num1 + "\n" + num2; // return top 1 and 2 in a string.
  return result;
};

console.log(getClosestInstances(survivers));
