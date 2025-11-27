#  Project Monitor – NestJS Backend

The **Project Monitor** is a complete **role-based project management backend** built using **NestJS + MongoDB**.  
It provides APIs for managing **users**, **teams**, **projects**, and **tasks**, with strict role-based actions for **Admin**, **Manager**, and **User**.

---

## **Core Modules**

###  User Module
Handles:
- User Authentication (Register / Login)
- Role Management (Admin, Manager, Team Lead / Member (User))

---

###  Team Module
Includes:
- Create teams (Admin)
- Assign **Manager** & **Team Lead**
- Add / Remove Team Members
- Fetch Teams by Manager
- Fetch Team by Member

---

###  Project Module
Features:
- Create & Update Projects (Admin / Manager)
- Assign Project to Team
- Retrieve Projects by Manager
- Track project timelines & status

---

###  Task Module
Supports:
- Create and assign tasks to team members
- Priority & Status management
- Fetch tasks by team, project, manager, or member


---


## AUTHENTICATION APIs

---

### **Register User**
**POST** `/auth/register`

#### Request
```json
{
  "name": "John Doe",
  "email": "john@gmail.com",
  "password": "123456",
  "designation": "Developer",
  "role": "user"
}
```

#### Response
```json
{
    "message": "registered",
    "user": {
        "_id": "6927f5ee80c8a9b18ad956a4",
        "name": "John Doe",
        "email": "john@gmail.com",
        "designation": "Developer",
        "role": "user",
        "status": "active"
    }
}
```

---

### **Login User**
**POST** `admin: /auth/admin/login` `manager: /auth/manager/login` `user: /auth/user/login`

#### Request
```json
{
  "email": "john@gmail.com",
  "password": "123456"
}
```

#### Response
```json
{
  "accessToken": "jwt-token-string",
}
```
---

# USER APIs

---
### **Get All Working Users**
**POST** `/users/get-all   (only admin token must)`

#### Response
```json
[
    {
        "_id": "6927f86e80c8a9b18ad956a7",
        "name": "manager1",
        "email": "manager1@gmail.com",
        "designation": "MBA",
        "role": "manager",
        "status": "active",
        "lastLogin": "27/11/2025, 2:50:45 pm",
        "isWorking": "active",
        "joiningDate": "27/11/2025, 12:36:22 pm"
    },
    {
        "_id": "6927f89480c8a9b18ad956aa",
        "name": "user1",
        "email": "user1@gmail.com",
        "designation": "fullstack",
        "role": "user",
        "status": "active",
        "lastLogin": "27/11/2025, 12:49:30 pm",
        "isWorking": "active",
        "joiningDate": "27/11/2025, 12:37:00 pm"
    }
]
```
---

### **Soft Delete**
**POST** `/users/deactivate/:id   (only admin token must)`

#### Response
```json
"user deactivated successfully"
```
---

# TEAM APIs

---

### **Create Team**
**POST** `/teams/create  (only admin token must)`

#### Request
```json
{
  "name": "Team Alpha",
  "manager": "65f11b8c02d8f1238d12af65",
  "teamLead": "65f11b8c02d8f1238d12af99",
  "members": [
    "65f11b8c02d8f1238d12af77",
    "65f11b8c02d8f1238d12af88"
  ]
}
```

#### Response
```json
{
    "name": "Team Alpha",
    "manager": {
        "_id": "65f11b8c02d8f1238d12af65",
        "name": "manager1",
        "role": "manager"
    },
    "teamLead": {
        "_id": "65f11b8c02d8f1238d12af99",
        "name": "user1",
        "role": "user"
    },
    "members": [
        {
            "_id": "65f11b8c02d8f1238d12af77",
            "name": "user2",
            "role": "user"
        },
        {
            "_id": "65f11b8c02d8f1238d12af88",
            "name": "user3",
            "role": "user"
        }
    ],
    "_id": "6927f95980c8a9b18ad956b6",
    "createdAt": "2025-11-27T07:10:17.438Z",
    "updatedAt": "2025-11-27T07:10:17.438Z",
}
```

---

### **Get All Teams**
**GET** `/teams/get (only admin token must)`

#### Response
```json
[
    {
        "_id": "6927f95980c8a9b18ad956b6",
        "name": "Development",
        "manager": {
            "_id": "6927f86e80c8a9b18ad956a7",
            "name": "manager1",
            "role": "manager"
        },
        "teamLead": {
            "_id": "6927f89480c8a9b18ad956aa",
            "name": "user1",
            "role": "user"
        },
        "members": [
            {
                "_id": "6927f8aa80c8a9b18ad956ad",
                "name": "user2",
                "role": "user"
            },
            {
                "_id": "6927f8bf80c8a9b18ad956b0",
                "name": "user3",
                "role": "user"
            }
        ],
        "createdAt": "2025-11-27T07:10:17.438Z",
        "updatedAt": "2025-11-27T07:10:17.438Z",
    }
]
```

---

### **Update Team**
**GET** `/teams/update/:id (only admin token must)`

### Request
```json
partially to create 
```

#### Response
```json
{
    "name": "Team Alpha",
    "manager": {
        "_id": "65f11b8c02d8f1238d12af65",
        "name": "manager1",
        "role": "manager"
    },
    "teamLead": {
        "_id": "65f11b8c02d8f1238d12af99",
        "name": "user1",
        "role": "user"
    },
    "members": [
        {
            "_id": "65f11b8c02d8f1238d12af77",
            "name": "user2",
            "role": "user"
        },
        {
            "_id": "65f11b8c02d8f1238d12af88",
            "name": "user3",
            "role": "user"
        }
    ],
    "_id": "6927f95980c8a9b18ad956b6",
    "createdAt": "2025-11-27T07:10:17.438Z",
    "updatedAt": "2025-11-27T07:10:17.438Z",
}
```

---

### **Delete**
**POST** `/team/delete/:id`

#### Response
```json
{
  "message": "Team Deleted Successfully",
}
```
---

### **Get Members Under Manager**
**GET** `/teams/manager/team  (only managers token must)`

#### Response
```json
{
    "managerId": "6927f86e80c8a9b18ad956a7",
    "teams": [
        {
            "teamId": "6927f95980c8a9b18ad956b6",
            "teamLead": {
                "_id": "6927f89480c8a9b18ad956aa",
                "name": "user1",
                "designation": "fullstack",
                "status": "active"
            },
            "members": [
                {
                    "_id": "6927f8aa80c8a9b18ad956ad",
                    "name": "user2",
                    "designation": "frontend",
                    "status": "active"
                },
                {
                    "_id": "6927f8bf80c8a9b18ad956b0",
                    "name": "user3",
                    "designation": "backend",
                    "status": "active"
                }
            ]
        }
    ]
}
```

---

### **Get Member Details**
**GET** `/teams/get (only user token must)`

#### Response
```json
{
    "teamName": "Development",
    "manger": {
        "_id": "6927f86e80c8a9b18ad956a7",
        "name": "manager1",
        "email": "manager1@gmail.com"
    },
    "teamLead": {
        "_id": "6927f89480c8a9b18ad956aa",
        "name": "user1",
        "email": "user1@gmail.com"
    },
    "user": {
        "name": "user1",
        "email": "user1@gmail.com",
        "designation": "fullstack",
        "status": "active",
        "joined": "27/11/2025, 12:37:00 pm"
    }
}
```

---

# PROJECT APIs

---

### **Create Project**
**POST** `/projects/save (only admin token must)`

#### Request
```json
{
  "title": "Website Redesign",
  "description": "Complete redesign of company website",
  "client": "CLIENT'S NAME"
  "team": "65f1304d9123cd45ac91df12"
}
```

#### Response
```json
{
    "title": "Website Redesign",
    "description": "Complete redesign of company website",
    "client": "CLIENT'S NAME",
    "status": "pending",
    "team": {
        "_id": "6927f95980c8a9b18ad956b6",
        "name": "Design",
        "manager": "6927f86e80c8a9b18ad956a7",
        "teamLead": "6927f89480c8a9b18ad956aa",
        "members": [
            "6927f8aa80c8a9b18ad956ad",
            "6927f8bf80c8a9b18ad956b0"
        ],
        "createdAt": "2025-11-27T07:10:17.438Z",
        "updatedAt": "2025-11-27T07:10:17.438Z",
    },
    "_id": "6928164ab420238a1d93e228",
    "createdAt": "2025-11-27T09:13:46.147Z",
    "updatedAt": "2025-11-27T09:13:46.147Z",
}
```

---

### **Get Projects**
**GET** `/projects/get-all (only admin token must)`

####  Response
```json
[
    {
        "_id": "6928164ab420238a1d93e228",
        "title": "Project1",
        "description": "project1 product",
        "client": "external",
        "status": "pending",
        "team": {
            "_id": "6927f95980c8a9b18ad956b6",
            "name": "Development",
            "manager": {
                "_id": "6927f86e80c8a9b18ad956a7",
                "name": "manager1",
                "email": "manager1@gmail.com"
            },
            "teamLead": {
                "_id": "6927f89480c8a9b18ad956aa",
                "name": "user1",
                "email": "user1@gmail.com"
            },
            "members": [
                {
                    "_id": "6927f8aa80c8a9b18ad956ad",
                    "name": "user2",
                    "email": "user2@gmail.com"
                },
                {
                    "_id": "6927f8bf80c8a9b18ad956b0",
                    "name": "user3",
                    "email": "user3@gmail.com"
                }
            ],
            "createdAt": "2025-11-27T07:10:17.438Z",
            "updatedAt": "2025-11-27T07:10:17.438Z",
        },
        "createdAt": "2025-11-27T09:13:46.147Z",
        "updatedAt": "2025-11-27T09:13:46.147Z",
    }
]
```

---

### **Create Project By Manager**
**POST** `/projects/manager/create (only manager token must)`

#### Request
```json
{
  "title": "Website Redesign",
  "description": "Complete redesign of company website",
  "client": "CLIENT'S NAME"
  "team": "65f1304d9123cd45ac91df12"
}
```

####  Response
```json
{
    "title": "Website Redesign",
    "description": "Complete redesign of company website",
    "client": "CLIENT'S NAME",
    "status": "pending",
    "team": {
        "_id": "6927f95980c8a9b18ad956b6",
        "name": "Design",
        "manager": "6927f86e80c8a9b18ad956a7",
        "teamLead": "6927f89480c8a9b18ad956aa",
        "members": [
            "6927f8aa80c8a9b18ad956ad",
            "6927f8bf80c8a9b18ad956b0"
        ],
        "createdAt": "2025-11-27T07:10:17.438Z",
        "updatedAt": "2025-11-27T07:10:17.438Z",
    },
    "_id": "6928164ab420238a1d93e228",
    "createdAt": "2025-11-27T09:13:46.147Z",
    "updatedAt": "2025-11-27T09:13:46.147Z",
}
```

---

### **2. Get Projects**
**GET** `/projects/manager/all (only managers token must)`

#### Response
```json
[
    {
        "_id": "6928164ab420238a1d93e228",
        "title": "Project1",
        "description": "project1 product",
        "client": "external",
        "status": "pending",
        "team": {
            "_id": "6927f95980c8a9b18ad956b6",
            "name": "Development",
            "manager": "6927f86e80c8a9b18ad956a7",
            "teamLead": "6927f89480c8a9b18ad956aa",
            "members": [
                "6927f8aa80c8a9b18ad956ad",
                "6927f8bf80c8a9b18ad956b0"
            ],
            "createdAt": "2025-11-27T07:10:17.438Z",
            "updatedAt": "2025-11-27T07:10:17.438Z",
        },
        "createdAt": "2025-11-27T09:13:46.147Z",
        "updatedAt": "2025-11-27T09:13:46.147Z",
    }
]
```

---

# Tasks APIs

---

### **Create Project**
**POST** `/tasks/save (admin/manager token must)`

#### Request
```json
{
    "title": "develop landing pages",
    "description": "landing pages for home, about, contact",
    "priority": "medium",
    "dueDate": "30-11-2025",
    "project": "PROJECT_OBJECT_ID",
    "assignedTo": "USER_OBJECT_ID"

}
```

#### Response
```json
{
    "title": "develop landing pages",
    "description": "landing pages for home, about, contact",
    "status": "pending",
    "priority": "medium",
    "dueDate": "30-11-2025",
    "project": {
        "_id": "6928164ab420238a1d93e228",
        "title": "Project1",
        "description": "project1 product",
        "client": "external",
        "status": "pending",
    },
    "assignedTo": {
        "_id": "6927f8aa80c8a9b18ad956ad",
        "name": "user2",
        "email": "user2@gmail.com",
        "designation": "frontend",
        "status": "active",
        "lastLogin": "27/11/2025, 12:37:22 pm",
        "isWorking": "active",
        "joiningDate": "27/11/2025, 12:37:22 pm",
    },
    "_id": "69281a1ab420238a1d93e238",
    "createdAt": "2025-11-27T09:30:02.047Z",
    "updatedAt": "2025-11-27T09:30:02.047Z",
}
```

---

### **2. Get Projects**
**GET** `/tasks/get-all (only Admin token must)`

#### Response
```json
[
    {
        "_id": "69281a1ab420238a1d93e238",
        "title": "develop landing pages",
        "description": "landing pages for home, about, contact",
        "status": "pending",
        "priority": "medium",
        "dueDate": "30-11-2025",
        "project": {
            "_id": "6928164ab420238a1d93e228",
            "title": "Project1"
        },
        "assignedTo": {
            "_id": "6927f8aa80c8a9b18ad956ad",
            "name": "user2",
            "email": "user2@gmail.com"
        },
        "createdAt": "2025-11-27T09:30:02.047Z",
        "updatedAt": "2025-11-27T09:30:02.047Z",
    }
]
```

---

### **Update Project**
**PUT** `/tasks/save (admin/manager token must)`

#### Request
```json
similar like create just adjust the status
```

#### Response
```json
{
    "title": "develop landing pages",
    "description": "landing pages for home, about, contact",
    "status": "pending",
    "priority": "medium",
    "dueDate": "30-11-2025",
    "project": {
        "_id": "6928164ab420238a1d93e228",
        "title": "Project1",
        "description": "project1 product",
        "client": "external",
        "status": "pending",
    },
    "assignedTo": {
        "_id": "6927f8aa80c8a9b18ad956ad",
        "name": "user2",
        "email": "user2@gmail.com",
        "designation": "frontend",
        "status": "active",
        "lastLogin": "27/11/2025, 12:37:22 pm",
        "isWorking": "active",
        "joiningDate": "27/11/2025, 12:37:22 pm",
    },
    "_id": "69281a1ab420238a1d93e238",
    "createdAt": "2025-11-27T09:30:02.047Z",
    "updatedAt": "2025-11-27T09:30:02.047Z",
}
```

---

### **Delete Project**
**DELETE** `/tasks/delete (admin/manager token must)`

#### Response
```json
{
  message: "Task Deleted successfully"
}
```

---
### **Get Projects that belongs to manager**
**POST** `/tasks/manager/my-tasks (only manager token must)`

#### Response
```json
[
    {
        "_id": "69281a1ab420238a1d93e238",
        "title": "develop landing pages",
        "description": "landing pages for home, about, contact",
        "status": "pending",
        "priority": "medium",
        "dueDate": "30-11-2025",
        "project": {
            "_id": "6928164ab420238a1d93e228",
            "title": "Project1"
        },
        "assignedTo": {
            "_id": "6927f8aa80c8a9b18ad956ad",
            "name": "user2",
            "email": "user2@gmail.com"
        },
        "createdAt": "2025-11-27T09:30:02.047Z",
        "updatedAt": "2025-11-27T09:30:02.047Z",
    }
]
```

---


