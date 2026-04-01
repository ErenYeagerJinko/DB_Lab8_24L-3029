create procedure sp_LoginUser
@Email VARCHAR(100),
@Password VARCHAR(100)
as
begin
select UserID, FullName from Users
where Email = @Email and PasswordHash = @Password;
end;
go

create procedure sp_GetExperience
@UserID int
as
begin
select ExpID, JobTitle, CompanyName, YearsWorked, IsCurrentJob
from Experience
where UserID = @UserID
order by ExpID desc;
end;
go

create procedure sp_AddExperience
@UserID int,
@JobTitle varchar(100),
@CompanyName varchar(100),
@YearsWorked int
as
begin
insert into Experience (UserID, JobTitle, CompanyName, YearsWorked, IsCurrentJob)
values (@UserID, @JobTitle, @CompanyName, @YearsWorked, 0);

select 'Experience added successfully!' as Message,
        scope_identity() as NewExpID;
end;
go
