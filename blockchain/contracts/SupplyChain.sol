// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SupplyChain
 * @dev ChainMed - Decentralized Medical Supply Chain Tracker
 * Tracks pharmaceutical products from manufacturer to patient
 */
contract SupplyChain {
    
    // ============ ENUMS ============
    
    enum Role { NONE, MANUFACTURER, DISTRIBUTOR, PHARMACY, HOSPITAL, ADMIN }
    
    enum Status {
        MANUFACTURED,
        IN_TRANSIT_TO_DISTRIBUTOR,
        AT_DISTRIBUTOR,
        IN_TRANSIT_TO_PHARMACY,
        AT_PHARMACY,
        IN_TRANSIT_TO_HOSPITAL,
        AT_HOSPITAL,
        DISPENSED,
        RECALLED
    }

    // ============ STRUCTS ============
    
    struct Product {
        uint256 id;
        string name;
        string batchNumber;
        string manufacturer;
        uint256 manufactureDate;
        uint256 expiryDate;
        Status currentStatus;
        address currentHolder;
        bool isAuthentic;
        bool exists;
    }
    
    struct TrackingEvent {
        uint256 productId;
        Status status;
        address actor;
        string location;
        uint256 timestamp;
        string notes;
    }
    
    struct Actor {
        string name;
        Role role;
        bool isActive;
    }
    
    // ============ STATE VARIABLES ============
    
    address public owner;
    uint256 public productCount;
    
    mapping(uint256 => Product) public products;
    mapping(uint256 => TrackingEvent[]) public productHistory;
    mapping(address => Actor) public actors;
    
    // ============ EVENTS ============
    
    event ProductRegistered(uint256 indexed productId, string name, string batchNumber, address manufacturer);
    event StatusUpdated(uint256 indexed productId, Status newStatus, address actor, string location);
    event ActorRegistered(address indexed actor, Role role, string name);
    event ProductRecalled(uint256 indexed productId, address recaller, string reason);
    
    // ============ MODIFIERS ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    modifier onlyRegistered() {
        require(actors[msg.sender].role != Role.NONE, "Actor not registered");
        require(actors[msg.sender].isActive, "Actor is not active");
        _;
    }
    
    modifier productExists(uint256 productId) {
        require(products[productId].exists, "Product does not exist");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    constructor() {
        owner = msg.sender;
        actors[msg.sender] = Actor("Admin", Role.ADMIN, true);
        emit ActorRegistered(msg.sender, Role.ADMIN, "Admin");
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    function registerActor(address actorAddress, Role role, string memory name) 
        external onlyOwner {
        require(role != Role.NONE, "Invalid role");
        actors[actorAddress] = Actor(name, role, true);
        emit ActorRegistered(actorAddress, role, name);
    }
    
    function deactivateActor(address actorAddress) external onlyOwner {
        actors[actorAddress].isActive = false;
    }
    
    // ============ PRODUCT FUNCTIONS ============
    
    function registerProduct(
        string memory name,
        string memory batchNumber,
        string memory manufacturerName,
        uint256 expiryDate
    ) external onlyRegistered returns (uint256) {
        require(actors[msg.sender].role == Role.MANUFACTURER || actors[msg.sender].role == Role.ADMIN, 
            "Only manufacturers can register products");
        
        productCount++;
        uint256 productId = productCount;
        
        products[productId] = Product({
            id: productId,
            name: name,
            batchNumber: batchNumber,
            manufacturer: manufacturerName,
            manufactureDate: block.timestamp,
            expiryDate: expiryDate,
            currentStatus: Status.MANUFACTURED,
            currentHolder: msg.sender,
            isAuthentic: true,
            exists: true
        });
        
        productHistory[productId].push(TrackingEvent({
            productId: productId,
            status: Status.MANUFACTURED,
            actor: msg.sender,
            location: "Manufacturing Plant",
            timestamp: block.timestamp,
            notes: "Product manufactured and registered on blockchain"
        }));
        
        emit ProductRegistered(productId, name, batchNumber, msg.sender);
        return productId;
    }
    
    function updateStatus(
        uint256 productId,
        Status newStatus,
        string memory location,
        string memory notes
    ) external onlyRegistered productExists(productId) {
        Product storage product = products[productId];
        
        // Validate role-based status transitions
        _validateTransition(product.currentStatus, newStatus, actors[msg.sender].role);
        
        product.currentStatus = newStatus;
        product.currentHolder = msg.sender;
        
        productHistory[productId].push(TrackingEvent({
            productId: productId,
            status: newStatus,
            actor: msg.sender,
            location: location,
            timestamp: block.timestamp,
            notes: notes
        }));
        
        emit StatusUpdated(productId, newStatus, msg.sender, location);
    }
    
    function recallProduct(uint256 productId, string memory reason) 
        external onlyRegistered productExists(productId) {
        require(
            actors[msg.sender].role == Role.MANUFACTURER || actors[msg.sender].role == Role.ADMIN,
            "Only manufacturers or admins can recall products"
        );
        
        products[productId].currentStatus = Status.RECALLED;
        products[productId].isAuthentic = false;
        
        productHistory[productId].push(TrackingEvent({
            productId: productId,
            status: Status.RECALLED,
            actor: msg.sender,
            location: "RECALL",
            timestamp: block.timestamp,
            notes: reason
        }));
        
        emit ProductRecalled(productId, msg.sender, reason);
    }
    
    // ============ VIEW FUNCTIONS ============
    
    function getProduct(uint256 productId) external view productExists(productId) 
        returns (Product memory) {
        return products[productId];
    }
    
    function getProductHistory(uint256 productId) external view productExists(productId) 
        returns (TrackingEvent[] memory) {
        return productHistory[productId];
    }
    
    function getHistoryCount(uint256 productId) external view returns (uint256) {
        return productHistory[productId].length;
    }
    
    function verifyProduct(uint256 productId) external view productExists(productId) 
        returns (bool isAuthentic, bool isExpired, Status currentStatus) {
        Product memory p = products[productId];
        return (
            p.isAuthentic,
            block.timestamp > p.expiryDate,
            p.currentStatus
        );
    }
    
    function getActor(address actorAddress) external view 
        returns (string memory name, Role role, bool isActive) {
        Actor memory a = actors[actorAddress];
        return (a.name, a.role, a.isActive);
    }
    
    // ============ INTERNAL FUNCTIONS ============
    
    function _validateTransition(Status current, Status newStatus, Role role) internal pure {
        // Manufacturer can ship to distributor
        if (role == Role.MANUFACTURER) {
            require(
                current == Status.MANUFACTURED && newStatus == Status.IN_TRANSIT_TO_DISTRIBUTOR,
                "Invalid transition for manufacturer"
            );
        }
        // Distributor can receive and ship to pharmacy
        else if (role == Role.DISTRIBUTOR) {
            require(
                (current == Status.IN_TRANSIT_TO_DISTRIBUTOR && newStatus == Status.AT_DISTRIBUTOR) ||
                (current == Status.AT_DISTRIBUTOR && newStatus == Status.IN_TRANSIT_TO_PHARMACY),
                "Invalid transition for distributor"
            );
        }
        // Pharmacy can receive and ship to hospital or dispense
        else if (role == Role.PHARMACY) {
            require(
                (current == Status.IN_TRANSIT_TO_PHARMACY && newStatus == Status.AT_PHARMACY) ||
                (current == Status.AT_PHARMACY && newStatus == Status.IN_TRANSIT_TO_HOSPITAL) ||
                (current == Status.AT_PHARMACY && newStatus == Status.DISPENSED),
                "Invalid transition for pharmacy"
            );
        }
        // Hospital can receive
        else if (role == Role.HOSPITAL) {
            require(
                current == Status.IN_TRANSIT_TO_HOSPITAL && newStatus == Status.AT_HOSPITAL,
                "Invalid transition for hospital"
            );
        }
        // Admin can do anything
        else if (role == Role.ADMIN) {
            // Admin can make any transition
        }
        else {
            revert("Unauthorized role");
        }
    }
}
