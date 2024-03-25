import { AboutModel, AddressModel, ResumeModel, SkillModel } from "../schema/users.js"

/* -------------------------About Data------------------------------ */

export const getAbout = async (req, res) => {
    try {
        const user = await AboutModel.find();
        if (user.length > 0) {
            return res.status(200).json(user)
        }
        return res.status(404).json({ message: "No data find" })
    } catch (error) {
        res.status(500).json('Error retrieving users:', error);
    }
}

export const updateAbout = async (req, res) => {
    const fixedId = "65824ed2b2b420858e89b474";
    const { name, detail, prof } = req.body;
    try {
        const updateData = await AboutModel.findByIdAndUpdate(
            fixedId,
            { $set: { name: name, detail: detail, prof: prof } },
            { new: true }
        )
        if (!updateData) {
            return res.status(404).json({ message: "No data updated" })
        } else {
            return res.json(updateData)
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

/* -------------------------Address Data------------------------------ */

export const getAddress = async (req, res) => {
    try {
        const user = await AddressModel.find();
        if (user.length > 0) {
            return res.status(200).json(user)
        }
        return res.status(404).json({ message: "No data find" })
    } catch (error) {
        res.status(500).json('Error retrieving users');
    }
}

export const updateAddress = async (req, res) => {
    const fixedId = "65843805f77a83d8a703b08d";
    const { address, email, phono } = req.body;
    try {
        const updateData = await AddressModel.findByIdAndUpdate(
            fixedId,
            { $set: { address: address, email: email, phono: phono } },
            { new: true }
        );
        res.json(updateData)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

/* -------------------------Resume Data------------------------------ */

export const getResume = async (req, res) => {
    try {
        const user = await ResumeModel.find();
        if (user.length > 0) {
            return res.status(200).json(user)
        }
        return res.status(404).json({ message: "No data find" })
    } catch (error) {
        res.status(500).json('Error retrieving users')
    }
}

/* -------------------------Skill Data------------------------------ */

export const getSkill = async (req, res) => {
    try {
        const user = await SkillModel.find();
        if (user.length > 0) {
            return res.status(200).json(user)
        }
        return res.status(404).json({ message: "No data find" })
    } catch (error) {
        res.status(500).json('Error retrieving users');
    }
}

export const postSkill = async (req, res) => {
    const { percentage, color } = req.body;
    try {
        const newData = new SkillModel({ percentage, color });
        await newData.save();
        console.log('Data Saved to database', newData);
        res.status(201).json({ message: 'data received' })
    } catch (error) {
        res.status(500).json('Error retrieving users');
    }
}