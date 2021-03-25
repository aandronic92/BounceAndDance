/****** Object:  Table [dbo].[AppUser]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AppUser](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [nvarchar](30) NOT NULL,
	[LastName] [nvarchar](30) NULL,
	[DateOfBirth] [date] NOT NULL,
	[PhoneNumber] int NULL,
	[Email] [nvarchar](255) NOT NULL,
	[Password] [nvarchar](50) NOT NULL,
	[Role] [nvarchar](15) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[MEMBERSHIP]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MEMBERSHIP](
	[membershipId] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[membershipName] [varchar] (20) NOT NULL,
	[membershipSessions] [integer] NOT NULL,
	[membershipPrice] [integer] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[membershipId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[BOOTS]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BOOTS](
	[bootsId] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NULL,
	[bootsName] [nvarchar] (30) NOT NULL,
	[bootsSize] [nvarchar](3) NOT NULL,
	[bootsPrice] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[bootsId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[CLASS]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CLASS](
	[classId] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[className] [nvarchar] (20,
	[classDate] [date] NOT NULL,
	[classTime] [time] (7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[classId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]

FOREIGN KEY (Role) REFERENCES AppUser(Role)
GO


GO
SET IDENTITY_INSERT [dbo].[AppUser] ON 
GO
INSERT [dbo].[AppUser] ([UserId], [FirstName], [LastName],[DateOfBirth],[PhoneNumber], [Email], [Password], [Role]) VALUES (1, N'Client', N'One','1981-03-03', 1122334455, N'client@bounceanddance.com', N'Client1!', N'user')
GO
INSERT [dbo].[AppUser] ([UserId], [FirstName], [LastName],[DateOfBirth],[PhoneNumber], [Email], [Password], [Role]) VALUES (2, N'Instructor', N'One','1990-01-01', 1234567891, N'instructor@bounceanddance.com', N'Instructor1!', N'instructor')
GO
INSERT [dbo].[AppUser] ([UserId], [FirstName], [LastName], [DateOfBirth],[PhoneNumber],[Email], [Password], [Role]) VALUES (3, N'Admin', N'One','1989-02-02', 2233445566, N'admin@bounceanddance.com', N'Administrator1!', N'admin')
GO
SET IDENTITY_INSERT [dbo].[AppUser] OFF
GO


SET IDENTITY_INSERT [dbo].[MEMBERSHIP] ON 
GO
INSERT [dbo].[MEMBERSHIP] ([membershipId],[membershipName], [membershipSessions], [membershipPrice]) VALUES (1, N'Silver', 5, 50)
GO
INSERT [dbo].[MEMBERSHIP] ([membershipId], [membershipName], [membershipSessions], [membershipPrice]) VALUES (2, N'Gold', 7, 65)
GO
INSERT [dbo].[MEMBERSHIP] ([membershipId],[membershipName], [membershipSessions], [membershipPrice]) VALUES (3, N'Platinium', 11, 100)
GO
SET IDENTITY_INSERT [dbo].[MEMBERSHIP] OFF
GO

SET IDENTITY_INSERT [dbo].[BOOTS] ON 
GO
INSERT [dbo].[BOOTS] ([bootsId], [bootsName], [bootsSize], [bootsPrice]) VALUES (1, N'Bounce1', N'S',10 )
GO
INSERT [dbo].[BOOTS] ([bootsId], [bootsName], [bootsSize], [bootsPrice]) VALUES (2, N'Bounce2', N'M', 10)
GO
SET IDENTITY_INSERT [dbo].[BOOTS] OFF
GO
