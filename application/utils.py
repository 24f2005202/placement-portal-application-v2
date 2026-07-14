def roles_list(roles):                      # roles= [<Role 1>, <Role 2>,..]
    role_list = []
    for role in roles:
        role_list.append(role.name)
    return role_list                         # roles_list= ['admin', 'user']

def company_applications_list(all_companies):         
    company_applications= []
    for company in all_companies:
        if company.user.active == False:
            company_applications.append(company)
    return company_applications
                
def registered_company_list(all_companies):         
    registered_company_list= []
    for company in all_companies:
        if company.user.active == True:
            registered_company_list.append(company)
    return registered_company_list
                