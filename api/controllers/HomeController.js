var knex = require("../config/knex");
var RoomBs = require("../models/RoomModel")

class HomeController {
    constructor(router) {
        this.router = router;
        this.registerRouter();
    }

    registerRouter() {
        this.router.get("/blocks", (req, resp, next) =>
            this.getAllBlocks(req, resp, next)
        );
        this.router.get("/rooms", (req, resp, next) =>
            this.getRooms(req, resp, next)
        );
        this.router.post("/create-room", (req, resp, next) =>
            this.createRoom(req, resp, next)
        );
        this.router.post("/update-room", (req, resp, next) =>
            this.updateRoom(req, resp, next)
        );
        this.router.post("/delete-room", (req, resp, next) =>
            this.deleteRoom(req, resp, next)
        );
        this.router.get("/users", (req, resp, next) =>
            this.getUsers(req, resp, next)
        );
        this.router.post("/create-user", (req, resp, next) =>
            this.createUser(req, resp, next)
        );
        this.router.post("/update-room", (req, resp, next) =>
            this.updateUser(req, resp, next)
        );
    }

    async getAllBlocks(req, resp, next) {
        knex("blocks").select("*")
            .then(data => {
                return resp.json({
                    status: true,
                    data: data
                })
            })
    }

    async getRooms(req, resp, next) {
        let request = req.query || {}
        console.log("request:", request)

        RoomBs
            .query(q => {
                if (request.block) {
                    q.where("block_id", request.block)
                }
                if (request.etaj) {
                    q.where("block_id", request.etaj)
                }
            })
            .fetchAll({
                withRelated: [
                    "block"
                ]
            })
            .then(r => {
                let data = r ? r.serialize() : []
                return resp.json({
                    status: true,
                    data: data
                })
            })

        // knex("rooms").select("*")
        //     .then(data => {
        //         return resp.json({
        //             status: true,
        //             data: data
        //         })
        //     })
    }

    async updateRoom(req, resp, next) {
        let request = req.body

        console.log("request", request)

        let data = {
            nr: request.nr || "",
            camera: request.camera || "",
            capacity: request.capacity || "",
            block_id: request.block_id || "",
            etaj: request.etaj || "",
            type: request.type || "",
        }

        knex("rooms")
            .where("id", request.id)
            .update({
                ...data
            })
            .then(r => {
                return resp.json({
                    status: true,
                })
            })
    }

    async createRoom(req, resp, next) {
        let request = req.body

        let data = {
            nr: request.nr || "",
            camera: request.camera || "",
            capacity: request.capacity || "",
            block_id: request.block_id || "",
            etaj: request.etaj || "",
            type: request.type || "",
        }

        knex("rooms")
            .insert(data)
            .then(r => {
                return resp.json({
                    status: true,
                })
            })
    }

    async deleteRoom(req, resp, next) {
        let request = req.body

        knex("rooms")
            .where("id", request.id)
            .del()
            .then(r => {
                return resp.json({
                    status: true,
                })
            })
    }

    async getUsers(req, resp, next) {
        let request = req.query || {}

        knex("users").select("*")
            .then(data => {
                return resp.json({
                    status: true,
                    data: data
                })
            })
    }

    async createUser(req, resp, next) {
        let request = req.body

        let data = {
            type: request.type || "",
            name: request.name || "",
            email: request.email || "",
            year: request.year || "",
            grupa: request.grupa || "",
            departament: request.departament || "",
            necesita_cazare: request.necesita_cazare || "",
        }

        knex("users")
            .insert(data)
            .then(r => {
                return resp.json({
                    status: true,
                })
            })
    }

    async updateUser(req, resp, next) {
        let request = req.body

        let data = {
            type: request.type || "",
            name: request.name || "",
            email: request.email || "",
            year: request.year || "",
            grupa: request.grupa || "",
            departament: request.departament || "",
            necesita_cazare: request.necesita_cazare || "",
        }

        knex("users")
            .where("id", request.id)
            .update({
                ...data
            })
            .then(r => {
                return resp.json({
                    status: true,
                })
            })
    }
}

module.exports = HomeController