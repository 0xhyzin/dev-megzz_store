import { User } from "@prisma/client";
import { prisma } from "../database/data";
import { logger } from "../../utils/logger";
import bcrypt from "bcrypt";
import { RepositoiesHandler } from "../RepositoiesHandler";
import { userCreateInput } from "../models/user/user-create.input";

class UserRepository {
    public FindUserByEmail = async (email: string) => {
        let user: User | null;
        const repoHandler: RepositoiesHandler<User> = new RepositoiesHandler();
        try {
            logger.info("try Find User By Email ", { email: email, file: "UserRepo" });

            user = await prisma.user.findUnique({
                where: {
                    email: email
                },
            })
            if (user === null) {
                throw Error("There is no user with this email");
            }
        } catch (er) {
            logger.error("There is no user with this email", { email: email, errorMessege: er });
            repoHandler.message = "Log in first";
            repoHandler.isSucceed = false;
            repoHandler.body = null;
            return repoHandler;
        }
        logger.info("User Found Succssfuly", { email: user.email, name: `${user.first_name} ${user.last_name}` });
        repoHandler.message = "welcome back";
        repoHandler.isSucceed = true;
        repoHandler.body = user;
        return repoHandler;
    }
    public AddNewUser = async (newUser: userCreateInput) => {
        const repoHandler: RepositoiesHandler<User> = new RepositoiesHandler();
        try {
            logger.info("Add User in Database", { userRole: process.env.USER_ROLE });
            const user: User = await prisma.user.create({
                data: {
                    first_name: newUser.first_name,
                    last_name: newUser.last_name,
                    email: newUser.email,
                    phone: newUser.phone,
                    hash_password: newUser.hash_password,
                    role: {
                        create: {
                            roletype_id: process.env.USER_ROLE!
                        }
                    },
                }
            })
            logger.info('User created with all related data:', user);
            repoHandler.message = "welcome";
            repoHandler.isSucceed = true;
            repoHandler.body = user;
        } catch (er) {
            logger.error("Error when adding user data", { error: er });
            repoHandler.isSucceed = false;
            repoHandler.message = "try again later";
            repoHandler.body = null;
        }

        return repoHandler;
    }
    public FindUserById = async (userId: string) => {
        const repoHandler: RepositoiesHandler<User> = new RepositoiesHandler();
        let user;
        try {
            logger.info("try get user By Id", { userId: userId });
            user = await prisma.user.findUnique({
                where: {
                    user_id: userId
                }
            })
            if (user === null) {
                throw Error("no User Found")
            }
        } catch (er) {
            logger.error("No User Found Have this id", { userId: userId, errorMessege: er })
            repoHandler.isSucceed = false;
            repoHandler.message = "User Not found";
            repoHandler.body = null;
            return repoHandler;
        }
        logger.info("User Find Succssfuly", { email: user.email, name: `${user.first_name} ${user.last_name}` });
        repoHandler.message = "welcome ";
        repoHandler.isSucceed = true;
        repoHandler.body = user;
        return repoHandler;

    }
    public GetUserRole = async (userId: string) => {
        logger.info("try Get User Roles", { userId: userId });
        let roles;
        try {
            roles = await prisma.role.findMany({
                where: { user_id: userId },
                include: {
                    roletype: {
                        select: {
                            rolename: true,
                        }
                    }
                }
            })
            if (roles === null) {
                throw Error("some thing Wrong");
            }
        } catch (er) {
            logger.error("NO Roles Find", { userId: userId });
            return null;
        }
        return roles.map(role => role.roletype?.rolename)
    }
}
export const userRepository: UserRepository = new UserRepository();