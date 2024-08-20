import { Client, Databases,Storage,ID ,Query} from "appwrite";
import config from "../config/config";
export class Service{
    client=new Client();
    databases;
    storage;
    constructor(){
        this.client
        .setEndpoint(config.appwriteUrl)
        .setProject(config.appwriteProjectId);
        this.databases=new Databases(this.client);
        this.storage=new Storage(this.client)
    }
    async getPost(slug){
        try {
            return await this.databases.getDocument(config.appwriteDatabaseId,config.appwriteCollectionId,slug);
        } catch (error) {
            console.log("Appwrite service :: getPost() ", error);
            return false;
            
        }

    }
    async getPosts(queries=[Query.equal("status","active")]){
        try {
            return await this.databases.listDocuments(config.appwriteDatabaseId,config.appwriteCollectionId,queries);
        } catch (error) {
            console.log("Appwrite service :: getPosts() :: ",error);
            return false;
        }
    }

    async createPost({title,slug,content,featuredImage,status,userId}){
        try {
            return await this.databases.createDocument(
                config.appwriteDatabaseId,config.appwriteCollectionId,slug,
                {title,content,featuredImage,status,userId});
        } catch (error) {
            console.log("Appwrite service :: CreatePost() :: ",error);
            return false; 
        }
    }

    async updatePost(slug,{title,content,featuredImage,status}){
        try{
            return await this.databases.updateDocument(
                config.appwriteDatabaseId, // databaseId
                config.appwriteCollectionId, // collectionId
                slug, // documentId
                {title,content,featuredImage,status}// data (optional)
               
            );
        }catch(error){
            console.log("Appwrite service :: updatePost() :: ",error);
            return false;
        }
    }

    async deletePost(slug){
        try{
            await this.databases.deleteDocument(
                config.appwriteDatabaseId, // databaseId
                config.appwriteCollectionId, // collectionId
                slug // documentId               
            );
            return true;
        }catch(error){
            console.log("Appwrite service :: deletePost() :: ",error);
            return false;
        }
    }

    async uploadFile(file){
        try {
            return await this.storage.createFile(
                config.appwriteBucketId, // bucketId
                ID.unique() , // fileId
                file
            
            );
        } catch (error) {
            console.log("Appwrite service :: uploadFile() :: ",error);
            return false;
        }
    }

    async deleteFile(fileId){
        try {
            return await this.storage.deleteFile(
                config.appwriteBucketId, // bucketId
                fileId // fileid
            
            );
        } catch (error) {
            console.log("Appwrite service :: deleteFile() :: ",error);
            return false;
        }
    }
    getPreview(fileId){
        return this.storage.getFilePreview(
            config.appwriteBucketId,fileId
        ).href
    }

}
const service=new Service();
export default service;
