const testCases = [
    {
        complaint: "There has been no water supply in our street for three days",
        expectedCategory: "water"
    },
    {
        complaint: "The drinking water pipe is leaking near our house",
        expectedCategory: "water"
    },
    {
        complaint: "There is no water coming from the public tap",
        expectedCategory: "water"
    },
    {
        complaint: "Our area has had a water shortage for a week",
        expectedCategory: "water"
    },
    {
        complaint: "The water pipeline in our street is broken",
        expectedCategory: "water"
    },

    {
        complaint: "There is a large pothole on the main road",
        expectedCategory: "roads"
    },
    {
        complaint: "The road near our school is badly damaged",
        expectedCategory: "roads"
    },
    {
        complaint: "A large portion of our street road has collapsed",
        expectedCategory: "roads"
    },
    {
        complaint: "There are many potholes making it difficult to travel",
        expectedCategory: "roads"
    },
    {
        complaint: "The road surface has become dangerous after the rain",
        expectedCategory: "roads"
    },

    {
        complaint: "There has been a power cut in our area since morning",
        expectedCategory: "electricity"
    },
    {
        complaint: "The electricity transformer near our street is not working",
        expectedCategory: "electricity"
    },
    {
        complaint: "Our house has no electricity supply",
        expectedCategory: "electricity"
    },
    {
        complaint: "The street lights are not working",
        expectedCategory: "electricity"
    },
    {
        complaint: "There is a damaged electric pole in our locality",
        expectedCategory: "electricity"
    },

    {
        complaint: "The government health center in our area is closed",
        expectedCategory: "health"
    },
    {
        complaint: "There are no doctors available at the public hospital",
        expectedCategory: "health"
    },
    {
        complaint: "The local health center does not have medicines",
        expectedCategory: "health"
    },
    {
        complaint: "An ambulance is urgently needed in our area",
        expectedCategory: "health"
    },
    {
        complaint: "The public hospital is overcrowded and patients cannot get treatment",
        expectedCategory: "health"
    },

    {
        complaint: "Garbage has not been collected from our street",
        expectedCategory: "sanitation"
    },
    {
        complaint: "There is garbage piled up near the market",
        expectedCategory: "sanitation"
    },
    {
        complaint: "The garbage bins in our area are overflowing",
        expectedCategory: "sanitation"
    },
    {
        complaint: "Our street has not been cleaned for many days",
        expectedCategory: "sanitation"
    },
    {
        complaint: "There is a bad smell from accumulated garbage",
        expectedCategory: "sanitation"
    },

    {
        complaint: "The public park in our area is poorly maintained",
        expectedCategory: "other"
    },
    {
        complaint: "A government building in our locality needs maintenance",
        expectedCategory: "other"
    },
    {
        complaint: "The traffic signal near our junction is not functioning",
        expectedCategory: "other"
    },
    {
        complaint: "There is a broken public bench near the bus stop",
        expectedCategory: "other"
    },
    {
        complaint: "I need information about a government service",
        expectedCategory: "other"
    }
];

module.exports = testCases;