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
	[membership_id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[membership_name] [varchar] (20) NOT NULL,
	[sessions] [integer] NOT NULL,
	[membership_price] [integer] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[membership_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[BOOTS]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BOOTS](
	[boots_id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NULL,
	[boots_size] [nvarchar](3) NOT NULL,
	[price] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[boots_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[CLASS]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CLASS](
	[class_id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[class_date] [date] NOT NULL,
	[class_time] [time] (7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[class_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Here I need to double check with someone ******/
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

/****** Here I need to double check with someone ******/

SET IDENTITY_INSERT [dbo].[MEMBERSHIP] ON 
GO
INSERT [dbo].[MEMBERSHIP] ([membership_id],[membership_name], [sessions], [membership_price]) VALUES (1, N'Silver', 5, 50)
GO
INSERT [dbo].[MEMBERSHIP] ([membership_id], [membership_name], [sessions], [membership_price]) VALUES (2, N'Gold', 7, 65)
GO
INSERT [dbo].[MEMBERSHIP] ([membership_id],[membership_name], [sessions], [membership_price]) VALUES (3, N'Platinium', 11, 100)
GO
SET IDENTITY_INSERT [dbo].[MEMBERSHIP] OFF
GO

SET IDENTITY_INSERT [dbo].[BOOTS] ON 
GO
INSERT [dbo].[BOOTS] ([boots_id], [boots_size], [price]) VALUES (1, N'S',10 )
GO
INSERT [dbo].[BOOTS] ([boots_id], [boots_size], [price]) VALUES (2, N'M', 10)
GO
SET IDENTITY_INSERT [dbo].[BOOTS] OFF
GO


