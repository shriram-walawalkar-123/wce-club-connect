const Club=require('../../Models/ClubModel')
const mongoose = require('mongoose');
// Create or Update club details
const clubDescription = async (req, res) => {
    console.log("userdata",req);
    try {
        const {
            clubName,
            department,
            establishmentYear,
            typeOfClub,
            specialization,
            clubLogo,
            motto,
            objectives,
            facultyAdvisor
        } = req?.body;
        const id=req?.user?.id;
        // console.log(req?.user);
        const clubId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id;
        console.log("clubId",clubId);

        // console.log("user ",req?.user);
        let club = await Club.findOne({ clubId });

        if (club) {
            // If club exists, update the existing record
            club.clubName = clubName;
            club.department = department;
            club.establishmentYear = establishmentYear;
            club.typeOfClub = typeOfClub;
            club.specialization = specialization;
            club.clubLogo = clubLogo;
            club.motto = motto;
            club.objectives = objectives;
            club.facultyAdvisor = facultyAdvisor;

            await club.save();

            return res.status(200).json({
                success: true,
                message: "Club details updated successfully",
                data: club
            });
        } else {
            // If club doesn't exist, create a new club entry
            const newClub = new Club({
                clubId,
                clubName,
                department,
                establishmentYear,
                typeOfClub,
                specialization,
                clubLogo,
                motto,
                objectives,
                facultyAdvisor
            });

            await newClub.save();

            return res.status(201).json({
                success: true,
                message: "Club created successfully",
                data: newClub
            });
        }

    } catch (err) {
        console.log("userdata",req);
        return res.status(500).json({
            success: false,
            message: "Server error during clubDescription",
            error: err.message
        });
    }
};

module.exports = clubDescription;
