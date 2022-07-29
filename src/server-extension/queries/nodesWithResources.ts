export const NodesWithUsedResourcesQuery = `
    SELECT
    n.node_id,
    n.country
    n.city
    n.totalResources
FROM nodes n
    LEFT JOIN contract_resources cr on cr.node.node_id = n.node_id
`