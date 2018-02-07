import { Client } from "config/initialize/mongoose"
import { calculateLoan, addDays } from "app/services/utils"

describe("#total_sum_loans", () => {

  it('should return valid values', async () => {
    let client = await factory.create('client')
    let loan1 = await factory.create('loan')
    let loan2 = await factory.create('loan')

    await client.addLoan(loan1)
    await client.addLoan(loan2)

    expect(client.total_sum_loans).toEqual(loan1.sum + loan2.sum)
  })

})
