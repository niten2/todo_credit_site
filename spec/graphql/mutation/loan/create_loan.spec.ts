import { Loan } from "config/initialize/mongoose"

const query = `
  mutation createLoan($input: LoanCreateInput!) {
    createLoan(input: $input) {
      ${matchers.loan_attr()}
    }
  }
`

describe("valid params given", () => {
  describe("user manager", () => {
    let res
    let loan
    let client
    const password = "password"

    beforeEach(async () => {
      let user = await factory.create('userManager')
      client = await factory.build('client')

      const variableValues = {
        input: {
          date_start: new Date(),
          date_end: new Date(),
          client: client.id,
        }
      }

      res = await execGraphql({ query, variableValues, user })
      console.log(res)
    })

    it('should return valid response', async () => {
      expect(res.data.createLoan).toEqual(matchers.loan_json())
    })

    it('should create user', async () => {
      loan = await Loan.findOne({ client: client.id })

      expect(loan).toEqual(expect.objectContaining({
        _id: expect.any(Object),

        date_start: expect.any(Date),
        date_end: expect.any(Date),
        client: client._id,
      })
    })
  })
})

describe("wrong params given", () => {
  describe("user admin", () => {
    it('manager should not create client', async () => {
      let user = await factory.create('userAdmin')
      let client = await factory.build('client')

      const variableValues = {
        input: {
          date_start: new Date(),
          date_end: new Date(),
          client: client.id,
        }
      }

      let res = await execGraphql({ query, variableValues, user })
      console.log(res)

      expect(res.errors).toContainEqual(expect.objectContaining({
        message: 'Cannot execute "create" on "Loan"',
      })
    })
  })

  it('should return error', async () => {
    const variableValues = {
      input: {}
    }

    const res = await execGraphql({ query, variableValues })

    expect(res.errors).toContainEqual(matchers.errors_json())
  })
})
