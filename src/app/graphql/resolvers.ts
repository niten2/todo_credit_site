import { User, Client, Loan } from "app/models"
import { createJwt } from "app/services/jwt"
import { calculatePersentLoan } from "app/services/utils"

const Query = {
  users: async (root: any, args: any) => {
    const users = await User.find()
    return users
  },

  user: async (root: any, args: any) => {
    const user = await User.findById(args.id)
    return user
  },

  clients: async (root: any, args: any) => {
    const clients = await Client.find()
    return clients
  },

  client: async (root: any, args: any) => {
    const client = await Client.findById(args.id)

    await Loan.populate(client, { path: "loans" })

    return client
  },

}

const Mutation = {

  createUser: async (root: any, args: any, ctx: any) => {
    ctx.ability.throwUnlessCan('create', User)

    const user = await User.create(args.input)
    return user
  },

  updateUser: async (root: any, args: any) => {
    const user = await User.findById(args.input.id)
    await user.set(args.input)
    await user.save()

    return user
  },

  deleteUser: async (_: any, args: any) => {
    const user = await User.findByIdAndRemove(args.input.id)
    return user
  },

  createToken: async (_: any, args: any): Promise<object> | never => {
    const { email, password } = args.input

    const user = await User.findOne({ email: email })

    if (!user) {
      throw new Error("user not found")
    }

    if (!await user.comparePassword(password)) {
      throw new Error("wrong password")
    }

    const value = await createJwt(user)

    return {
      id: user.id,
      email: user.email,
      value,
    }
  },

  createClient: async (root: any, args: any, ctx: any) => {
    ctx.ability.throwUnlessCan('create', Client)

    return await Client.create(args.input)
  },

  updateClient: async (root: any, args: any, ctx: any) => {
    ctx.ability.throwUnlessCan('update', Client)

    const client = await Client.findById(args.input.id)
    await client.set(args.input)
    await client.save()

    return client
  },

  deleteClient: async (_: any, args: any) => {
    const client = await Client.findByIdAndRemove(args.input.id)

    return client
  },

  createLoan: async (root: any, args: any, ctx: any) => {
    ctx.ability.throwUnlessCan('create', Loan)

    const client = await Client.findById(args.input.client)
    const loan =  await Loan.create(args.input)

    await client.addLoan(loan)

    return loan
  },

  caclulateLoan: async (root: any, args: any, ctx: any) => {
    const { sum, territory, date_start, date_end, client } = args.input

    let client_object = await Client.findById(client).populate({ path: "territory"})

    let total = calculatePersentLoan({
      sum: sum,
      territory: client_object.territory.rate,
      date_start: new Date(date_start),
      date_end: new Date(date_end),
    })

    return { total }
  },

}

export default { Query, Mutation }
