describe('Complete quests with only commands', () => {
  it('Complete quest : get-started', () => {
    cy.CompleteStageWithCommands('get-started')
  })
  it('Complete quest : cast', () => {
    cy.CompleteStageWithCommands('cast')
  })
  it('Complete quest : explore', () => {
    cy.CompleteStageWithCommands('explore')
  })
  it('Complete quest : path', () => {
    cy.CompleteStageWithCommands('path')
  })
  it('Complete quest : read', () => {
    cy.CompleteStageWithCommands('read')
  })
  it('Complete quest : create', () => {
    cy.CompleteStageWithCommands('create')
  })
  it('Complete quest : copy', () => {
    cy.CompleteStageWithCommands('copy')
  })
  it('Complete quest : move', () => {
    cy.CompleteStageWithCommands('move')
  })
  it('Complete quest : remove', () => {
    cy.CompleteStageWithCommands('remove')
  })
  it('Complete quest : helloworld', () => {
    cy.CompleteStageWithCommands('helloworld')
  })
})
