package com.boot.cut_costs.dto.expense;

import java.util.List;

import com.boot.cut_costs.dto.group.get.SnippetGetGroupDto;
import com.boot.cut_costs.dto.user.GetUserDto;

public class ExtendedGetExpenseDto extends GetExpenseDto {

	private static final long serialVersionUID = 1L;

	private SnippetGetGroupDto groupDto;
	
	private List<GetUserDto> sharers;
	
	private String imageId;
	
	private String description;
	
	public String getImageId() {
		return imageId;
	}

	public void setImageId(String imageId) {
		this.imageId = imageId;
	}

	public SnippetGetGroupDto getGroup() {
		return groupDto;
	}

	public void setGroup(SnippetGetGroupDto group) {
		this.groupDto = group;
	}

	public List<GetUserDto> getSharers() {
		return sharers;
	}

	public void setSharers(List<GetUserDto> sharers) {
		this.sharers = sharers;
	}
	
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
}
