import { UserRepository } from "../../userResource/repository/user.repository"
import { AdminRepository } from "../repository/admin.repository"

export class AdminService {
    adminRepository: AdminRepository

    constructor () {
        this.adminRepository = new AdminRepository()
    }

    async getAllShipments () {
        return await this.adminRepository.getAllShipments()
    }
    async getAllUsersByRole (role: string) {
        return await this.adminRepository.getAllUsersByRole(role as 'customer' | 'partner')
    }

    async getPaternersDetails (role: string) {
        const allRoleWithPartners = await this.getAllUsersByRole(role)
        const partnersId = allRoleWithPartners.map(roleWithPartners => roleWithPartners.id)
        const partnerProfile = await this.adminRepository.getProfilesForSpecificUser(partnersId)
        const partnerCommision = await this.adminRepository.getPartnersCommision(partnersId)

        return { allRoleWithPartners, partnerProfile, partnerCommision }
    }

    async getAllPayments () {
        return await this.adminRepository.getAllPayment()
    }
}