const { CosmosClient } = require('@azure/cosmos');

// Cosmos DB client for delete operations (needs SDK for point delete)
let cosmosClient = null;
let container = null;

function getContainer() {
    if (!container) {
        const connectionString = process.env.CosmosDbConnectionString;
        cosmosClient = new CosmosClient(connectionString);
        const database = cosmosClient.database('LeetCodeTracker');
        container = database.container('SharedPatterns');
    }
    return container;
}

module.exports = async function (context, req) {
    const id = req.params.id;
    
    // GET - Fetch all shared content
    if (req.method === "GET") {
        const documents = context.bindings.inputDocuments || [];
        context.res = {
            status: 200,
            body: documents
        };
        return;
    }
    
    // POST - Add new shared content
    if (req.method === "POST") {
        const data = req.body;
        
        if (!data || !data.type || !data.createdBy) {
            context.res = {
                status: 400,
                body: { error: "Missing required fields: type, createdBy" }
            };
            return;
        }
        
        // Validate type
        const validTypes = ['topic', 'pattern', 'problem'];
        if (!validTypes.includes(data.type)) {
            context.res = {
                status: 400,
                body: { error: "Invalid type. Must be: topic, pattern, or problem" }
            };
            return;
        }
        
        const newDoc = {
            id: data.id || `shared-${data.type}-${Date.now()}`,
            type: data.type,
            parentId: data.parentId || null,
            title: data.title || data.name,
            createdBy: data.createdBy,
            createdAt: new Date().toISOString(),
            data: data.data || {}
        };
        
        context.bindings.outputDocument = newDoc;
        
        context.res = {
            status: 201,
            body: {
                message: "Shared content created successfully",
                item: newDoc
            }
        };
        return;
    }
    
    // DELETE - Remove shared content (only by creator)
    if (req.method === "DELETE") {
        if (!id) {
            context.res = {
                status: 400,
                body: { error: "Missing id parameter" }
            };
            return;
        }
        
        const userId = req.headers['x-user-id'] || req.query.userId;
        if (!userId) {
            context.res = {
                status: 401,
                body: { error: "User ID required for delete operation" }
            };
            return;
        }
        
        try {
            const containerRef = getContainer();
            
            // First, find the document to check ownership
            const documents = context.bindings.inputDocuments || [];
            const docToDelete = documents.find(d => d.id === id);
            
            if (!docToDelete) {
                context.res = {
                    status: 404,
                    body: { error: "Document not found" }
                };
                return;
            }
            
            // Check if user is the creator
            if (docToDelete.createdBy !== userId) {
                context.res = {
                    status: 403,
                    body: { error: "Only the creator can delete this content" }
                };
                return;
            }
            
            // Delete the document
            await containerRef.item(id, docToDelete.type).delete();
            
            context.res = {
                status: 200,
                body: { message: "Deleted successfully", id: id }
            };
        } catch (error) {
            context.log.error('Delete error:', error);
            context.res = {
                status: 500,
                body: { error: "Failed to delete: " + error.message }
            };
        }
        return;
    }
    
    context.res = {
        status: 405,
        body: { error: "Method not allowed" }
    };
};
